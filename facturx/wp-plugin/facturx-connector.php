<?php
/**
 * Plugin Name: FacturX Connect pour WooCommerce
 * Description: Facturation électronique conforme (Factur-X / EN 16931) — chaque commande génère automatiquement sa facture électronique via le service FacturX Connect.
 * Version: 0.1.0
 * Requires Plugins: woocommerce
 * Author: FacturX Connect
 *
 * ⚠️ MVP non testé sur une installation WordPress réelle — connecteur minimal
 * à valider sur un environnement WooCommerce avant distribution.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Envoie la commande au service FacturX Connect dès qu'elle est finalisée. */
add_action('woocommerce_order_status_completed', 'fxc_send_order_to_service');

function fxc_send_order_to_service($order_id)
{
    $order = wc_get_order($order_id);
    if (!$order) {
        return;
    }

    $lines = [];
    foreach ($order->get_items() as $item) {
        $qty = max(1, (int) $item->get_quantity());
        $total_ht = (float) $order->get_line_total($item, false, false);
        $total_tax = (float) $order->get_line_tax($item);
        $lines[] = [
            'name' => $item->get_name(),
            'quantity' => $qty,
            'unitPriceHT' => round($total_ht / $qty, 2),
            'vatRate' => $total_ht > 0 ? round($total_tax / $total_ht * 100, 1) : 0,
        ];
    }

    if ((float) $order->get_shipping_total() > 0) {
        $ship_ht = (float) $order->get_shipping_total();
        $ship_tax = (float) $order->get_shipping_tax();
        $lines[] = [
            'name' => 'Livraison',
            'quantity' => 1,
            'unitPriceHT' => round($ship_ht, 2),
            'vatRate' => $ship_ht > 0 ? round($ship_tax / $ship_ht * 100, 1) : 0,
        ];
    }

    $payload = [
        'orderRef' => 'WC-' . $order->get_order_number(),
        'buyer' => [
            'name' => trim($order->get_formatted_billing_full_name()) ?: 'Client',
            'address' => trim($order->get_billing_address_1() . ', ' . $order->get_billing_postcode() . ' ' . $order->get_billing_city()),
            'siren' => null,
            'vatNumber' => null,
        ],
        'lines' => $lines,
    ];

    $api_url = rtrim(get_option('fxc_api_url', ''), '/');
    if (!$api_url) {
        return;
    }

    wp_remote_post($api_url . '/api/orders', [
        'headers' => [
            'Content-Type' => 'application/json',
            'x-api-key' => get_option('fxc_api_key', ''),
        ],
        'body' => wp_json_encode($payload),
        'timeout' => 15,
    ]);
}

/** Réglages : Réglages → FacturX Connect. */
add_action('admin_menu', function () {
    add_options_page('FacturX Connect', 'FacturX Connect', 'manage_options', 'facturx-connect', 'fxc_settings_page');
});

add_action('admin_init', function () {
    register_setting('fxc', 'fxc_api_url');
    register_setting('fxc', 'fxc_api_key');
});

function fxc_settings_page()
{
    ?>
    <div class="wrap">
        <h1>FacturX Connect</h1>
        <p>Connectez votre boutique au service de facturation électronique Factur-X.</p>
        <form method="post" action="options.php">
            <?php settings_fields('fxc'); ?>
            <table class="form-table">
                <tr>
                    <th><label for="fxc_api_url">URL du service</label></th>
                    <td><input type="url" id="fxc_api_url" name="fxc_api_url"
                               value="<?php echo esc_attr(get_option('fxc_api_url', '')); ?>"
                               class="regular-text" placeholder="https://app.facturx-connect.fr"></td>
                </tr>
                <tr>
                    <th><label for="fxc_api_key">Clé API</label></th>
                    <td><input type="password" id="fxc_api_key" name="fxc_api_key"
                               value="<?php echo esc_attr(get_option('fxc_api_key', '')); ?>"
                               class="regular-text"></td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}
