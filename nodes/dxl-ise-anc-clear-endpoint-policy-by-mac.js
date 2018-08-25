/**
 * @module DxlIseAncClearEndpointPolicyByMac
 * @description Implementation of the
 * `dxl-ise-anc-clear-endpoint-policy-by-mac` node
 * @private
 */

'use strict'

var dxl = require('@opendxl/dxl-client')
var bootstrap = require('@opendxl/dxl-bootstrap')
var nodeRedDxl = require('@opendxl/node-red-contrib-dxl')
var NodeUtils = nodeRedDxl.NodeUtils
var util = require('../lib/util')

var ISE_EVENT_ANC_CLEAR_ENDPOINT_POLICY_BY_MAC_TOPIC = util.ISE_ANC_PREFIX +
  'clearendpointpolicybymac'

module.exports = function (RED) {
  /**
   * @classdesc Node which clears a policy from an endpoint by its MAC address
   * using Cisco Adaptive Network Control (ANC).
   * @param {Object} nodeConfig - Configuration data which the node uses.
   * @param {String} [nodeConfig.policyName] - Name of the policy to clear. If
   *   the value is empty, the policy name will be derived from the input
   *   message's `msg.policyName` property.
   * @param {String} [nodeConfig.returnType=obj] - Controls the data type for
   *   the response payload, set as `msg.payload`. If returnType is 'bin',
   *   `msg.payload` is a raw binary Buffer. If returnType is 'txt',
   *   `msg.payload` is a String (decoded as UTF-8). If returnType is 'obj', is
   *   an Object (decoded as a JSON document from the original payload). If an
   *   error occurs when attempting to convert the binary Buffer of the payload
   *   into the desired data type, the current flow is halted with an error.
   * @private
   * @constructor
   */
  function IseAncClearEndpointPolicyByMacNode (nodeConfig) {
    RED.nodes.createNode(this, nodeConfig)

    /**
     * Controls the data type for the result payload.
     * @type {String}
     * @private
     */
    this._returnType = nodeConfig.returnType || 'obj'

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
      this.on('input', function (msg) {
        var macAddress = NodeUtils.extractProperty(msg, 'macAddress')
        var policyName = NodeUtils.defaultIfEmpty(nodeConfig.policyName,
          NodeUtils.extractProperty(msg, 'policyName'))
        if (!macAddress) {
          node.error('macAddress property was not specified')
        } else if (!policyName) {
          node.error('policyName property was not specified')
        } else if (!node._client.connected) {
          this.error('Unable to send request, not connected')
        } else {
          var request = new dxl.Request(
            ISE_EVENT_ANC_CLEAR_ENDPOINT_POLICY_BY_MAC_TOPIC)
          bootstrap.MessageUtils.objectToJsonPayload(request, {
            mac: macAddress,
            policyName: policyName
          })
          this._client.asyncRequest(request,
            function (error, response) {
              if (error) {
                node.error(error.message, msg)
              } else {
                try {
                  msg.payload = nodeRedDxl.MessageUtils.decodePayload(response,
                    node._returnType)
                  node.send(msg)
                } catch (e) {
                  node.error(
                    'Error converting response to object. Error: ' +
                    e.message + ', Payload: ' + response.payload, msg)
                }
              }
            }
          )
        }
      })
      this.on('close', function (done) {
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

  RED.nodes.registerType('dxl-ise-anc-clear-endpoint-policy-by-mac',
    IseAncClearEndpointPolicyByMacNode)
}
