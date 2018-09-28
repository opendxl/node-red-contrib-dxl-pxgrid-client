The Cisco pxGrid DXL Node-RED client package
includes JSON documents with sample Node-RED flows. To import samples into
Node-RED, perform the following steps:

1. In the upper-right corner of the Node-RED UI, press the side menu button.

1. Select one of examples under
   `Import → Examples → dxl pxgrid-client` in the menu drop-down list.

In order for the sample flows to execute properly, Node-RED must be able to
connect to a DXL fabric. For more information on connecting to a DXL fabric from
Node-RED, see the
[Client Configuration](https://opendxl.github.io/node-red-contrib-dxl/jsdoc/tutorial-configuration.html)
section in the OpenDXL Node-RED package documentation.

See the following sections for an overview of each sample.

### Cisco Identity Services Engine (ISE) Operation Samples

#### Basic ISE ANC Apply Endpoint Policy by IP Address (basic-ise-anc-apply-endpoint-policy-by-ip)

This sample applies a Cisco Adaptive Network Control (ANC) policy to an endpoint
via DXL and Cisco pxGrid. The sample identifies the endpoint by its
IP address.

#### Basic ISE ANC Clear Endpoint Policy by IP Address (basic-ise-anc-clear-endpoint-policy-by-ip)

This sample clears a Cisco Adaptive Network Control (ANC) policy from an
endpoint via DXL and Cisco pxGrid. The sample identifies the endpoint by its IP
address.

#### Basic ISE ANC Apply Endpoint Policy by MAC Address (basic-ise-anc-apply-endpoint-policy-by-mac)

This sample applies a Cisco Adaptive Network Control (ANC) policy to an endpoint
via DXL and Cisco pxGrid. The sample identifies the endpoint by its MAC address.

#### Basic ISE ANC Clear Endpoint Policy by MAC Address (basic-ise-anc-clear-endpoint-policy-by-mac)

This sample clears a Cisco Adaptive Network Control (ANC) policy from an
endpoint via DXL and Cisco pxGrid. The sample identifies the endpoint by its MAC
address.

### Cisco Identity Services Engine (ISE) Notification Samples

#### Basic ISE ANC Apply Endpoint Policy Notification (basic-ise-anc-apply-endpoint-policy-notification)

This sample registers for Cisco Adaptive Network Control (ANC) apply endpoint
policy notifications via DXL and Cisco pxGrid.

#### Basic ISE ANC Clear Endpoint Policy Notification (basic-ise-anc-clear-endpoint-policy-notification)

This sample registers for Cisco Adaptive Network Control (ANC) clear endpoint
policy notifications via DXL and Cisco pxGrid.

#### Basic ISE Session Notification (basic-ise-session-notification)

This sample registers for Cisco Identity Services Engine (ISE) session
notifications via DXL and Cisco pxGrid.
