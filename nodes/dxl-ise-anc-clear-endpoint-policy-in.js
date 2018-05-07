'use strict'

var bootstrap = require('@opendxl/dxl-bootstrap')
var MessageUtils = bootstrap.MessageUtils
var util = require('../lib/util')

var ISE_EVENT_ANC_CLEAR_ENDPOINT_POLICY_TOPIC = util.ISE_ANC_EVENT_PREFIX +
  'clearendpointpolicy'

module.exports = function (RED) {
  function IseClearApplyEndpointPolicyInNode (nodeConfig) {
    RED.nodes.createNode(this, nodeConfig)

    /**
     * Handle to the DXL client node used to make requests to the DXL fabric.
     * @type {Client}
     * @private
     */
    this._client = RED.nodes.getNode(nodeConfig.client)

    var node = this

    this.status({
      fill: 'red',
      shape: 'ring',
      text: 'node-red:common.status.disconnected'
    })

    if (this._client) {
      this._client.registerUserNode(this)
      var callback = function (event) {
        try {
          node.send({payload: MessageUtils.jsonPayloadToObject(event)})
        } catch (e) {
          node.error('Error converting event to json. Error: ' + e.message +
            ', Payload: ' + event.payload, {payload: event.payload})
        }
      }
      this._client.addEventCallback(ISE_EVENT_ANC_CLEAR_ENDPOINT_POLICY_TOPIC,
        callback)
      this.on('close', function (done) {
        node._client.removeEventCallback(
          ISE_EVENT_ANC_CLEAR_ENDPOINT_POLICY_TOPIC, callback)
        node._client.unregisterUserNode(node, done)
      })
      if (this._client.connected) {
        this.status({
          fill: 'green',
          shape: 'dot',
          text: 'node-red:common.status.connected'
        })
      }
    } else {
      this.error('Missing client configuration')
    }
  }

  RED.nodes.registerType('dxl-ise-anc-clear-endpoint-policy in',
    IseClearApplyEndpointPolicyInNode)
}
