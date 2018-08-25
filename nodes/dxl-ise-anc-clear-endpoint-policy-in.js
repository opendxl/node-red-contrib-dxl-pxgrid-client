/**
 * @module DxlIseAncClearEndpointPolicyIn
 * @description Implementation of the
 * `dxl-ise-anc-clear-endpoint-policy in` node
 * @private
 */

'use strict'

var MessageUtils = require('@opendxl/node-red-contrib-dxl').MessageUtils
var util = require('../lib/util')

var ISE_EVENT_ANC_CLEAR_ENDPOINT_POLICY_TOPIC = util.ISE_ANC_EVENT_PREFIX +
  'clearendpointpolicy'

module.exports = function (RED) {
  /**
   * @classdesc Node which registers to receive "clear endpoint policy" events
   * from Cisco Adaptive Network Control (ANC).
   * @param {Object} nodeConfig - Configuration data which the node uses.
   * @param {String} [nodeConfig.payloadType=obj] - Controls the data type for
   *   the event payload, set as `msg.payload`. If payloadType is 'bin',
   *   `msg.payload` is a raw binary Buffer. If payloadType is 'txt',
   *   `msg.payload` is a String (decoded as UTF-8). If payloadType is 'obj', is
   *   an Object (decoded as a JSON document from the original payload). If an
   *   error occurs when attempting to convert the binary Buffer of the payload
   *   into the desired data type, the current flow is halted with an error.
   * @private
   * @constructor
   */
  function IseClearApplyEndpointPolicyInNode (nodeConfig) {
    RED.nodes.createNode(this, nodeConfig)

    /**
     * Controls the data type for the event payload.
     * @type {String}
     * @private
     */
    this._payloadType = nodeConfig.payloadType || 'obj'

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
          node.send({payload: MessageUtils.decodePayload(event,
            node._payloadType)})
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
