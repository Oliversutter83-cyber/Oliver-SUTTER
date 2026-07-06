<?php
/**
 * Plugin Name: AccessiScan – Audit accessibilité RGAA
 * Plugin URI: https://accessiscan.fr
 * Description: Analysez l'accessibilité RGAA de votre site en un clic : score de risque, liste des non-conformités avec extraits de code, et générateur de déclaration d'accessibilité conforme au modèle légal.
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Author: AccessiScan
 * Author URI: https://accessiscan.fr
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: accessiscan
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'ACCESSISCAN_VERSION', '1.0.0' );
define( 'ACCESSISCAN_PRO_URL', 'https://accessiscan.fr/?utm_source=plugin&utm_medium=wp-admin' );

/* -------------------------------------------------------------------------
 * Menu d'administration
 * ---------------------------------------------------------------------- */

add_action( 'admin_menu', 'accessiscan_admin_menu' );
function accessiscan_admin_menu() {
	add_menu_page(
		__( 'AccessiScan — Audit accessibilité', 'accessiscan' ),
		__( 'AccessiScan', 'accessiscan' ),
		'manage_options',
		'accessiscan',
		'accessiscan_render_page',
		'dashicons-universal-access-alt',
		80
	);
}

/* -------------------------------------------------------------------------
 * Moteur d'audit : mêmes contrôles que le scanner accessiscan.fr,
 * implémentés avec DOMDocument (natif PHP).
 * ---------------------------------------------------------------------- */

function accessiscan_run_audit( $url ) {
	$response = wp_remote_get(
		$url,
		array(
			'timeout'    => 15,
			'user-agent' => 'AccessiScan-Plugin/' . ACCESSISCAN_VERSION,
		)
	);

	if ( is_wp_error( $response ) ) {
		return new WP_Error( 'fetch_failed', __( 'Impossible de récupérer la page d’accueil du site.', 'accessiscan' ) );
	}

	$html = wp_remote_retrieve_body( $response );
	if ( '' === $html ) {
		return new WP_Error( 'empty_body', __( 'La page d’accueil a renvoyé un contenu vide.', 'accessiscan' ) );
	}

	$previous = libxml_use_internal_errors( true );
	$dom      = new DOMDocument();
	$dom->loadHTML( '<?xml encoding="UTF-8">' . $html );
	libxml_clear_errors();
	libxml_use_internal_errors( $previous );

	$findings = array();
	$score    = 100;

	$add = function ( $id, $rgaa, $title, $severity, $weight, $advice, $hits ) use ( &$findings, &$score ) {
		$count = count( $hits );
		if ( 0 === $count ) {
			return;
		}
		$penalty   = min( $weight, (int) round( $weight * ( 0.5 + 0.125 * ( $count - 1 ) ) ) );
		$score    -= $penalty;
		$findings[] = array(
			'id'       => $id,
			'rgaa'     => $rgaa,
			'title'    => $title,
			'severity' => $severity,
			'count'    => $count,
			'excerpts' => array_slice( $hits, 0, 3 ),
			'advice'   => $advice,
		);
	};

	$excerpt = function ( DOMElement $node ) use ( $dom ) {
		$tag = preg_replace( '/\s+/', ' ', $dom->saveHTML( $node ) );
		return function_exists( 'mb_strimwidth' ) ? mb_strimwidth( $tag, 0, 140, '…' ) : substr( $tag, 0, 140 );
	};

	// 1. Images sans alt (RGAA 1.1)
	$hits = array();
	foreach ( $dom->getElementsByTagName( 'img' ) as $img ) {
		if ( ! $img->hasAttribute( 'alt' ) && 'presentation' !== $img->getAttribute( 'role' ) && ! $img->hasAttribute( 'aria-hidden' ) ) {
			$hits[] = $excerpt( $img );
		}
	}
	$add(
		'img-alt',
		'RGAA 1.1',
		__( 'Images sans alternative textuelle (attribut alt)', 'accessiscan' ),
		'critical',
		15,
		__( 'Chaque image doit porter un attribut alt : descriptif si elle est porteuse d’information, vide (alt="") si elle est décorative.', 'accessiscan' ),
		$hits
	);

	// 2. Liens vides (RGAA 6.1, 6.2)
	$hits = array();
	foreach ( $dom->getElementsByTagName( 'a' ) as $a ) {
		if ( ! $a->hasAttribute( 'href' ) || $a->hasAttribute( 'aria-label' ) || $a->hasAttribute( 'aria-labelledby' ) || $a->hasAttribute( 'title' ) ) {
			continue;
		}
		if ( '' !== trim( preg_replace( '/\s+/', ' ', $a->textContent ) ) ) {
			continue;
		}
		$named_img = false;
		foreach ( $a->getElementsByTagName( 'img' ) as $img ) {
			if ( '' !== trim( $img->getAttribute( 'alt' ) ) ) {
				$named_img = true;
				break;
			}
		}
		if ( ! $named_img ) {
			$hits[] = $excerpt( $a );
		}
	}
	$add(
		'empty-links',
		'RGAA 6.1, 6.2',
		__( 'Liens sans intitulé (vides pour un lecteur d’écran)', 'accessiscan' ),
		'critical',
		15,
		__( 'Un lien doit avoir un nom accessible : texte visible, aria-label, ou image avec alt descriptif.', 'accessiscan' ),
		$hits
	);

	// 3. Champs sans étiquette (RGAA 11.1)
	$label_for = array();
	foreach ( $dom->getElementsByTagName( 'label' ) as $label ) {
		if ( $label->hasAttribute( 'for' ) ) {
			$label_for[ $label->getAttribute( 'for' ) ] = true;
		}
	}
	$hits = array();
	foreach ( array( 'input', 'select', 'textarea' ) as $tag_name ) {
		foreach ( $dom->getElementsByTagName( $tag_name ) as $field ) {
			$type = strtolower( $field->getAttribute( 'type' ) ?: 'text' );
			if ( in_array( $type, array( 'hidden', 'submit', 'button', 'image', 'reset' ), true ) ) {
				continue;
			}
			if ( $field->hasAttribute( 'aria-label' ) || $field->hasAttribute( 'aria-labelledby' ) || $field->hasAttribute( 'title' ) ) {
				continue;
			}
			$id = $field->getAttribute( 'id' );
			if ( $id && isset( $label_for[ $id ] ) ) {
				continue;
			}
			$hits[] = $excerpt( $field );
		}
	}
	$add(
		'form-labels',
		'RGAA 11.1',
		__( 'Champs de formulaire sans étiquette', 'accessiscan' ),
		'critical',
		15,
		__( 'Chaque champ doit être relié à un <label for="…">, ou porter aria-label / aria-labelledby / title.', 'accessiscan' ),
		$hits
	);

	// 4. Langue absente (RGAA 8.3, 8.4)
	$html_el = $dom->getElementsByTagName( 'html' )->item( 0 );
	$lang    = $html_el ? $html_el->getAttribute( 'lang' ) : '';
	$add(
		'html-lang',
		'RGAA 8.3, 8.4',
		__( 'Langue de la page absente ou invalide', 'accessiscan' ),
		'critical',
		10,
		__( 'La balise <html> doit porter lang="fr" (ou la langue réelle du contenu).', 'accessiscan' ),
		( $lang && preg_match( '/^[a-z]{2,3}(-[a-z0-9]+)*$/i', $lang ) ) ? array() : array( '<html lang="…"> manquant' )
	);

	// 5. Titre de page (RGAA 8.5, 8.6)
	$title_el = $dom->getElementsByTagName( 'title' )->item( 0 );
	$add(
		'page-title',
		'RGAA 8.5, 8.6',
		__( 'Titre de page (<title>) absent ou vide', 'accessiscan' ),
		'critical',
		8,
		__( 'Chaque page doit avoir un <title> unique et descriptif.', 'accessiscan' ),
		( $title_el && '' !== trim( $title_el->textContent ) ) ? array() : array( '<title> manquant ou vide' )
	);

	// 6. Iframes sans titre (RGAA 2.1)
	$hits = array();
	foreach ( $dom->getElementsByTagName( 'iframe' ) as $iframe ) {
		if ( '' === trim( $iframe->getAttribute( 'title' ) ) && ! $iframe->hasAttribute( 'aria-hidden' ) ) {
			$hits[] = $excerpt( $iframe );
		}
	}
	$add(
		'iframe-title',
		'RGAA 2.1',
		__( 'Cadres (iframe) sans titre', 'accessiscan' ),
		'critical',
		8,
		__( 'Chaque iframe doit porter un attribut title décrivant son contenu.', 'accessiscan' ),
		$hits
	);

	// 7. Boutons muets (RGAA 11.9)
	$hits = array();
	foreach ( $dom->getElementsByTagName( 'button' ) as $button ) {
		if ( $button->hasAttribute( 'aria-label' ) || $button->hasAttribute( 'aria-labelledby' ) || $button->hasAttribute( 'title' ) ) {
			continue;
		}
		if ( '' !== trim( preg_replace( '/\s+/', ' ', $button->textContent ) ) ) {
			continue;
		}
		$named_img = false;
		foreach ( $button->getElementsByTagName( 'img' ) as $img ) {
			if ( '' !== trim( $img->getAttribute( 'alt' ) ) ) {
				$named_img = true;
				break;
			}
		}
		if ( ! $named_img ) {
			$hits[] = $excerpt( $button );
		}
	}
	$add(
		'empty-buttons',
		'RGAA 11.9',
		__( 'Boutons sans nom accessible', 'accessiscan' ),
		'critical',
		10,
		__( 'Un bouton doit avoir un texte visible ou un aria-label.', 'accessiscan' ),
		$hits
	);

	// 8. Hiérarchie de titres (RGAA 9.1)
	$issues = array();
	$levels = array();
	$xpath  = new DOMXPath( $dom );
	foreach ( $xpath->query( '//h1|//h2|//h3|//h4|//h5|//h6' ) as $heading ) {
		$levels[] = (int) substr( $heading->nodeName, 1 );
	}
	if ( ! in_array( 1, $levels, true ) ) {
		$issues[] = __( 'Aucun <h1> sur la page', 'accessiscan' );
	}
	$count_levels = count( $levels );
	for ( $i = 1; $i < $count_levels; $i++ ) {
		if ( $levels[ $i ] - $levels[ $i - 1 ] > 1 ) {
			/* translators: 1: previous heading level, 2: next heading level */
			$issues[] = sprintf( __( 'Saut de niveau : h%1$d suivi de h%2$d', 'accessiscan' ), $levels[ $i - 1 ], $levels[ $i ] );
			break;
		}
	}
	$add(
		'heading-structure',
		'RGAA 9.1',
		__( 'Hiérarchie de titres incohérente', 'accessiscan' ),
		'warning',
		8,
		__( 'La page doit avoir un <h1>, sans saut de niveau (h2 → h4).', 'accessiscan' ),
		$issues
	);

	// 9. Zoom bloqué (RGAA 10.4)
	$hits = array();
	foreach ( $dom->getElementsByTagName( 'meta' ) as $meta ) {
		if ( 'viewport' !== strtolower( $meta->getAttribute( 'name' ) ) ) {
			continue;
		}
		$content = strtolower( $meta->getAttribute( 'content' ) );
		$blocked = preg_match( '/user-scalable\s*=\s*(no|0)/', $content );
		if ( ! $blocked && preg_match( '/maximum-scale\s*=\s*([\d.]+)/', $content, $m ) ) {
			$blocked = (float) $m[1] < 2;
		}
		if ( $blocked ) {
			$hits[] = $excerpt( $meta );
		}
	}
	$add(
		'zoom-blocked',
		'RGAA 10.4',
		__( 'Zoom bloqué sur mobile', 'accessiscan' ),
		'warning',
		6,
		__( 'Le meta viewport ne doit pas contenir user-scalable=no ni maximum-scale inférieur à 2.', 'accessiscan' ),
		$hits
	);

	$score = max( 0, min( 100, $score ) );

	$has_critical = false;
	foreach ( $findings as $finding ) {
		if ( 'critical' === $finding['severity'] ) {
			$has_critical = true;
			break;
		}
	}
	$risk = ( $has_critical || $score < 50 ) ? 'eleve' : ( $score < 80 ? 'moyen' : 'faible' );

	return array(
		'url'      => $url,
		'score'    => $score,
		'risk'     => $risk,
		'findings' => $findings,
		'at'       => current_time( 'mysql' ),
	);
}

/* -------------------------------------------------------------------------
 * Déclaration d'accessibilité (modèle légal, pré-remplie)
 * ---------------------------------------------------------------------- */

function accessiscan_generate_declaration( $org, $site_url, $email ) {
	$date = date_i18n( 'j F Y' );

	return "# Déclaration d'accessibilité\n\n"
		. "$org s'engage à rendre son service accessible, conformément à l'article 47 de la loi n° 2005-102 du 11 février 2005.\n\n"
		. "Cette déclaration d'accessibilité s'applique à $site_url.\n\n"
		. "## État de conformité\n\n"
		. "$site_url est non conforme avec le référentiel général d'amélioration de l'accessibilité (RGAA), version 4.1.2, en l'absence d'audit de conformité complet permettant d'établir un taux de conformité.\n\n"
		. "## Résultats des tests\n\n"
		. "Une analyse automatisée réalisée le $date avec l'extension AccessiScan a porté sur les critères du RGAA testables automatiquement (environ un tiers du référentiel). Cette analyse ne constitue pas un audit de conformité au sens du RGAA ; un audit manuel complet est nécessaire pour établir un taux de conformité.\n\n"
		. "## Établissement de cette déclaration d'accessibilité\n\n"
		. "Cette déclaration a été établie le $date.\n\n"
		. "## Retour d'information et contact\n\n"
		. "Si vous n'arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le responsable du site pour être orienté vers une alternative accessible ou obtenir le contenu sous une autre forme.\n\n"
		. "- E-mail : $email\n\n"
		. "## Voies de recours\n\n"
		. "Si vous avez signalé au responsable du site un défaut d'accessibilité et que vous n'avez pas obtenu de réponse satisfaisante, vous pouvez :\n\n"
		. "- Écrire un message au Défenseur des droits : https://formulaire.defenseurdesdroits.fr/\n"
		. "- Contacter le délégué du Défenseur des droits dans votre région : https://www.defenseurdesdroits.fr/saisir/delegues\n"
		. "- Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) : Défenseur des droits, Libre réponse 71120, 75342 Paris CEDEX 07\n";
}

/* -------------------------------------------------------------------------
 * Page d'administration
 * ---------------------------------------------------------------------- */

function accessiscan_render_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$result = null;
	$error  = null;

	if ( isset( $_POST['accessiscan_scan'] ) && check_admin_referer( 'accessiscan_scan_action', 'accessiscan_nonce' ) ) {
		$audit = accessiscan_run_audit( home_url( '/' ) );
		if ( is_wp_error( $audit ) ) {
			$error = $audit->get_error_message();
		} else {
			$result = $audit;
			update_option( 'accessiscan_last_result', $audit, false );
		}
	} else {
		$stored = get_option( 'accessiscan_last_result' );
		if ( is_array( $stored ) ) {
			$result = $stored;
		}
	}

	$declaration = accessiscan_generate_declaration(
		get_bloginfo( 'name' ),
		home_url( '/' ),
		get_option( 'admin_email' )
	);

	$risk_labels = array(
		'eleve'  => __( 'Risque juridique élevé', 'accessiscan' ),
		'moyen'  => __( 'Risque juridique moyen', 'accessiscan' ),
		'faible' => __( 'Risque résiduel — audit manuel recommandé', 'accessiscan' ),
	);
	$risk_colors = array(
		'eleve'  => '#b3261e',
		'moyen'  => '#8a5a00',
		'faible' => '#0c7a5a',
	);
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'AccessiScan — Audit accessibilité RGAA', 'accessiscan' ); ?></h1>
		<p style="max-width: 720px; font-size: 14px;">
			<?php esc_html_e( 'Depuis le 28 juin 2025, la directive européenne accessibilité s’applique aux sites e-commerce et services en ligne (entreprises de plus de 10 salariés ou 2 M€ de CA), avec des sanctions jusqu’à 50 000 € par service. Cette extension analyse votre page d’accueil contre les critères RGAA testables automatiquement.', 'accessiscan' ); ?>
		</p>

		<form method="post">
			<?php wp_nonce_field( 'accessiscan_scan_action', 'accessiscan_nonce' ); ?>
			<p>
				<button type="submit" name="accessiscan_scan" value="1" class="button button-primary button-hero">
					<?php esc_html_e( 'Analyser mon site maintenant', 'accessiscan' ); ?>
				</button>
			</p>
		</form>

		<?php if ( $error ) : ?>
			<div class="notice notice-error"><p><?php echo esc_html( $error ); ?></p></div>
		<?php endif; ?>

		<?php if ( $result ) : ?>
			<hr />
			<h2>
				<?php
				/* translators: %d: accessibility score out of 100 */
				printf( esc_html__( 'Score : %d / 100', 'accessiscan' ), (int) $result['score'] );
				?>
				— <span style="color: <?php echo esc_attr( $risk_colors[ $result['risk'] ] ); ?>;">
					<?php echo esc_html( $risk_labels[ $result['risk'] ] ); ?>
				</span>
			</h2>
			<p><em>
				<?php
				/* translators: %s: date/time of last scan */
				printf( esc_html__( 'Dernière analyse : %s — page d’accueil uniquement.', 'accessiscan' ), esc_html( $result['at'] ) );
				?>
			</em></p>

			<?php if ( empty( $result['findings'] ) ) : ?>
				<div class="notice notice-success inline"><p>
					<?php esc_html_e( 'Aucune non-conformité détectable automatiquement sur la page d’accueil. Les critères manuels (contrastes, clavier, vidéos…) restent à vérifier.', 'accessiscan' ); ?>
				</p></div>
			<?php else : ?>
				<table class="widefat striped" style="max-width: 980px;">
					<thead>
						<tr>
							<th><?php esc_html_e( 'Non-conformité', 'accessiscan' ); ?></th>
							<th><?php esc_html_e( 'Critère RGAA', 'accessiscan' ); ?></th>
							<th><?php esc_html_e( 'Occurrences', 'accessiscan' ); ?></th>
							<th><?php esc_html_e( 'Correction', 'accessiscan' ); ?></th>
						</tr>
					</thead>
					<tbody>
						<?php foreach ( $result['findings'] as $finding ) : ?>
							<tr>
								<td>
									<strong style="color: <?php echo 'critical' === $finding['severity'] ? '#b3261e' : '#8a5a00'; ?>;">
										<?php echo esc_html( $finding['title'] ); ?>
									</strong>
									<?php if ( ! empty( $finding['excerpts'] ) ) : ?>
										<br /><code style="font-size: 11px;"><?php echo esc_html( implode( ' … ', $finding['excerpts'] ) ); ?></code>
									<?php endif; ?>
								</td>
								<td><?php echo esc_html( $finding['rgaa'] ); ?></td>
								<td><?php echo (int) $finding['count']; ?></td>
								<td><?php echo esc_html( $finding['advice'] ); ?></td>
							</tr>
						<?php endforeach; ?>
					</tbody>
				</table>
			<?php endif; ?>

			<div style="margin-top: 20px; padding: 16px 20px; background: #1a1d5c; color: #fff; border-radius: 8px; max-width: 940px;">
				<h3 style="color: #fff; margin-top: 0;"><?php esc_html_e( 'Aller au bout de la mise en conformité', 'accessiscan' ); ?></h3>
				<p style="color: #c9cbf0;">
					<?php esc_html_e( 'AccessiScan Pro audite toutes les pages de votre site (fiches produit, tunnel de commande…), fournit un plan d’action priorisé, une surveillance mensuelle et un rapport PDF à présenter en cas de contrôle — à partir de 29 €/mois.', 'accessiscan' ); ?>
				</p>
				<a class="button button-primary" href="<?php echo esc_url( ACCESSISCAN_PRO_URL ); ?>" target="_blank" rel="noopener">
					<?php esc_html_e( 'Découvrir AccessiScan Pro', 'accessiscan' ); ?>
				</a>
			</div>
		<?php endif; ?>

		<hr style="margin-top: 30px;" />
		<h2><?php esc_html_e( 'Votre déclaration d’accessibilité (obligatoire)', 'accessiscan' ); ?></h2>
		<p style="max-width: 720px;">
			<?php esc_html_e( 'La loi impose la publication d’une déclaration d’accessibilité : c’est le premier document qu’un contrôleur vérifie, et son absence se constate en 10 secondes. Copiez ce texte pré-rempli dans une page « Accessibilité » de votre site et liez-la depuis votre pied de page.', 'accessiscan' ); ?>
		</p>
		<textarea readonly rows="16" style="width: 100%; max-width: 940px; font-family: monospace; font-size: 12px;" onclick="this.select();"><?php echo esc_textarea( $declaration ); ?></textarea>
	</div>
	<?php
}
