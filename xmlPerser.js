const XMLHttpRequest = require("xmlhttprequest")

const request = new XMLHttpRequest()

function sendName() {
    request.open('GET', 'https://httpbin.org/user-agent', true)
    request.onload = function () {
    	var data = JSON.parse(this.response)
    	console.log(data)
    }
    request.send()
}

module.exports = sendName()