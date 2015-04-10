
function Restriction () {
	this.generateRegister=function(){
		var register='visit:';
		register+=this.ip.deny+':';
		register+=this.dest.deny;
		return register;
	};
	this.deniesIp=function(incomingIP){
		return (this.ip.deny?incomingIP.match(this.ip.deny):false) && !(this.ip.allow?incomingIP.match(this.ip.allow||""):false);
	} //lo niega si esta negado y no esta explicitamente puesto en permitidos, si no tiene alguno de los campos, se asume que ese campo no molesta
	this.deniesPath=function(path){
		return path.match(this.path.deny)&& !path.match(this.path.allow||"") ;
	}
	this.deniesRequest=function(request){
		return this.deniesIpOrPath(request.connection.remoteAddress,request.url.parse(browserRequest.url).path)
	}
	this.deniesIpOrPath=function(ip,path){
		return this.deniesIp(ip)|| this.deniesPath(path)
	}

	this.ip={deny:""};
	this.dest={deny:""};
	this.times=0;
	this.interval=0;
}

var restriction1 = new Restriction();
restriction1.ip={deny:'200.42.23.2'}; //restriccion directa a la ip

var restriction2 = new Restriction();
restriction2.dest={deny:/^\/sites\/.*$/};
var restriction3=new Restriction();
restriction3.ip='200.42.23.2';
restriction3.path

module.exports=[restriction1,restriction2];