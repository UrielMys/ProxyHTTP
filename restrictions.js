var url=require('url')
function Restriction () {
	this.generateRegister=function(){
		var register='visit:';
		register+=this.ip.getRule()+':';
		register+=this.path.getRule();//+':';
//		register+=this.method.getRule();
		return register;
	};
	this.deniesIp=function(incomingIP){
		return incomingIP&&this.ip.matchesRestriction(incomingIP);
	} //lo niega si esta negado y no esta explicitamente puesto en permitidos, si no tiene alguno de los campos, se asume que ese campo no molesta
	this.match=function(ip,path){
		if(this.ipRestrictions&&this.pathRestrictions){
                     return this.deniesIpAndPath(ip,path)
                }
                if(this.ipRestrictions){
			return this.deniesIp(ip);
              	}
                return this.deniesPath(path);

	};
	this.deniesPath=function(path){
		return path&&this.path.matchesRestriction(path);
		}
	this.deniesRequest=function(request){
		return this.match(request.connection.remoteAddress,request.url);
	}
	this.deniesIpAndPath=function(ip,path){
		return this.deniesIp(ip)&& this.deniesPath(path)
	}
	this.denyIP=function(ip){this.ip.deny(ip);this.ipRestrictions++};
	this.allowIP=function(ip){this.ip.allow(ip)};
	this.denyPath=function(path){this.path.deny(path);this.pathRestrictions++};
	this.allowPath=function(path){this.path.allow(path)};
	this.ip=new Rule();
	this.path=new Rule();
	this.times=0;
	this.interval=1;
	this.ipRestrictions=0;
	this.pathRestrictions=0;
}
function Rule(){
	this.denied=[];
	this.allowed=[];
	this.deny=function(deniable){
		this.denied.push(deniable);
		return this
	}
	this.allow=function(allowable){
		this.allowed.push(allowable)
		return this
	}
	this.matchesRestriction=function(revision){
		return !this.allowed.some(this.match(revision))&&this.denied.some(this.match(revision))
	}
	this.match=function(revision){return function(element){return revision.match(element)};};
	this.getRule=function(){
		return this.denied.join()
	}
}
var rule1 = new Rule();
rule1.deny('200.42.23.2');
var rule2=new Rule();
rule2.deny(/^\/sites.*$/);
var rule3=new Rule();
rule3.deny(/^\/sites.*$/);
rule3.deny(/^\/items.*$/);
var restriction1 = new Restriction();
restriction1.denyIP('200.42.23.2'); //restriccion directa a la ip
restriction1.times=80;
restriction1.interval=15;

var restriction2 = new Restriction();
restriction2.denyPath(/^\/sites.*$/);
restriction2.times=2000;
restriction2.interval=60;
var restriction3=new Restriction();
restriction3.denyIP('200.42.23.2');
restriction3.denyPath(/^\/sites.*$/);
restriction3.times=300;
module.exports.restrictions=[restriction1,restriction2,restriction3];
module.exports.getRules=[rule1,rule2,rule3];
module.exports.Rule=Rule;
module.exports.Restriction=Restriction;