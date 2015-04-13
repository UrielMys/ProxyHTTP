var url=require('url')
function Restriction () {
	this.generateRegister=function(){
		var register='visit:';
		register+=this.ip.deny+':';
		register+=this.dest.deny;
		return register;
	};
	this.deniesIp=function(incomingIP){
		if(incomingIP){
			return (this.ip.deny?incomingIP.match(this.ip.deny):false) && !(this.ip.allow?incomingIP.match(this.ip.allow):false);
		}
		return false;
	} //lo niega si esta negado y no esta explicitamente puesto en permitidos, si no tiene alguno de los campos, se asume que ese campo no molesta
	this.deniesPath=function(dest){
		if(dest){
			return (this.dest.deny?dest.match(this.dest.deny):false) && !(this.dest.allow?dest.match(this.dest.allow):false);
		}
		return false;
	}
	this.deniesRequest=function(request){
		return this.deniesIpAndPath(request.connection.remoteAddress,request.url)
	}
	this.deniesIpAndPath=function(ip,dest){
		return this.deniesIp(ip)&& this.deniesPath(dest)
	}

	this.ip={deny:""};
	this.dest={deny:""};
	this.times=0;
	this.interval=1;
}

var restriction1 = new Restriction();
restriction1.ip={deny:'20.42.23.2'}; //restriccion directa a la ip
restriction1.times=80;
restriction1.interval=15;

var restriction2 = new Restriction();
restriction2.dest={deny:/^\/sites\/.*$/};
restriction2.times=20;
restriction2.interval=60;
var restriction3=new Restriction();
restriction3.ip={deny:'200.42.23.2'};
restriction3.dest={deny:/^\/sites\/.*$/}

module.exports=[restriction1,restriction2,restriction3];
