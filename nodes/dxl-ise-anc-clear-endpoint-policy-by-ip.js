'use strict'

var dxl = require('@opendxl/dxl-client')
var bootstrap = require('@opendxl/dxl-bootstrap')
var nodeRedDxl = require('@opendxl/node-red-contrib-dxl')
var NodeUtils = nodeRedDxl.NodeUtils
var util = require('../lib/util')

var ISE_EVENT_ANC_CLEAR_ENDPOINT_POLICY_BY_IP_TOPIC = util.ISE_ANC_PREFIX +
  'clearendpointpolicybyip'

module.exports = function (RED) {
  function IseAncClearEndpointPolicyByIpNode (nodeConfig) {
    RED.nodes.createNode(this, nodeConfig)

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
        var policy = NodeUtils.defaultIfEmpty(nodeConfig.policy, msg.policy)
        if (!msg.payload) {
          this.error(
            'Unable to send request, ip address not available in payload.')
        } else if (!policy) {
          this.error('Unable to send request, no policy available')
        } else if (!node._client.connected) {
          this.error('Unable to send request, not connected')
        } else {
          var request = new dxl.Request(
            ISE_EVENT_ANC_CLEAR_ENDPOINT_POLICY_BY_IP_TOPIC)
          bootstrap.MessageUtils.objectToJsonPayload(request, {
            ip: msg.payload,
            policyName: policy
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

  RED.nodes.registerType('dxl-ise-anc-clear-endpoint-policy-by-ip',
    IseAncClearEndpointPolicyByIpNode)
}
