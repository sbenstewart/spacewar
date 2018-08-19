var c, d, baseColor, p;
var mouse = { x : window.innerWidth/2, y : 0 };
var spaceships = [];
var team1 = [];
var team2 = [];
var bullets = []; 
var maxSpaceshipPerTeam = 100; 
var distanceAtk = 150;
var hasWinner = false;

$(document).ready(function(){ 
	init();
}); 

function init(){
	c = $('#degas')[0]; 
	c.width = window.innerWidth;
	c.height = window.innerHeight;

	d = new Degas( c ); 
	baseColor = "#ffffff";
	
	//Team 1 
	for( var i = 0; i < maxSpaceshipPerTeam; i++ ){
		var s = new Degas.RegularPolygon( 5, 3 );
		s.x = window.innerWidth * Math.random();
		s.y = window.innerHeight * Math.random();
		//s.stroke = '#fff'; 
		s.fill = '#fff';
		d.addChild( s ); 
		
		var sp = new Spaceship( s, 1 );
		spaceships.push( sp );
		team1.push( sp );  
	}
	
	//Team 2
	for( var i = 0; i < maxSpaceshipPerTeam; i++ ){
		var s = new Degas.RegularPolygon( 5, 3 );
		s.x = window.innerWidth * Math.random();
		s.y = window.innerHeight * Math.random();
		//s.stroke = '#fff';
		s.fill = '#FF9537';
		d.addChild( s );
		
		var sp = new Spaceship( s, 2 );
		spaceships.push( sp );
		team2.push( sp );
	}
	
	for( var i = 0; i < spaceships.length; i++ ){
		spaceships[i].getTarget();
	}
	
	loop(); 
 
	$(window).resize(function(){
		resize( window.innerWidth, window.innerHeight );
		d.resize();
	});
	
	$('#degas').bind('mousemove', function(e){
		mouse.x = e.offsetX;
		mouse.y = e.offsetY;
	});
}

function loop(){
	requestAnimationFrame( loop ); 
	
	if( hasWinner ){
		for( var i = 0; i < spaceships.length; i++ ){
			if( Math.abs(spaceships[i].target.x - spaceships[i].degas.x) < 5 && Math.abs(spaceships[i].target.y - spaceships[i].degas.y) < 5  ){
				spaceships[i].pointTo( window.innerWidth/2,  window.innerHeight/2 );
			}
			else{
				spaceships[i].pointTo( spaceships[i].target.x,  spaceships[i].target.y ); 
			}
			spaceships[i].moveToEnd();
		} 
	}	 
	
	if( !hasWinner ){
		for( var i = 0; i < spaceships.length; i++ ){
			spaceships[i].pointTo( spaceships[i].target.degas.x,  spaceships[i].target.degas.y );
			spaceships[i].moveToTarget();
		} 

		if( team1.length == 0 ){
			hasWinner = true;
			console.log('Team 2 win');
			end();
		}
		else if( team2.length == 0 ){
			hasWinner = true;
			console.log('Team 1 win');
			end();
		}
	}

	for( var i = 0; i < bullets.length; i++ ){
		bullets[i].x += (bullets[i].target.degas.x - bullets[i].x) / 10;  
		bullets[i].y += (bullets[i].target.degas.y - bullets[i].y) / 10;  

		if( bullets[i].target.pv <= 0 || bullets[i].owner.pv <= 0 ){
			bullets[i].opacity -= 0.05;

			if( bullets[i].opacity < 0 ){
				bullets[i].opacity = 0; 
			}
		}
	}
	
	d.render();
}

var Spaceship = function( degasObj, team ){
	this.degas = degasObj;
	this.team = team;
	this.pv = 50;
	this.power = 3 + Math.random() * 7; 
	this.canShoot = true;
	this.target;
	this.velX = Math.random()*2-1;
	this.velY = Math.random()*2-1;
}

Spaceship.prototype.pointTo = function( destX, destY ){
	var dist_Y = destY - this.degas.y;
	var dist_X = destX - this.degas.x;
	var angle = Math.atan2(dist_Y,dist_X);
	var degrees = angle * 180/ Math.PI;
	this.degas.rotation = degrees-30+180-120;
}

Spaceship.prototype.getTarget = function(){
	if( this.team == 1 && team2.length > 0 ){
		this.target = team2[ Math.round( (team2.length-1) * Math.random() ) ];
	}
	else if( this.team == 2 && team1.length > 0 ){
		this.target = team1[ Math.round( (team1.length-1) * Math.random() ) ];
	} 
}

Spaceship.prototype.moveToTarget = function(){
	
	if( Villani.distanceBetween( { x: this.degas.x, y: this.degas.y }, { x: this.target.degas.x, y: this.target.degas.y } ) > distanceAtk && this.target.pv > 0 ){ 
		this.degas.x += (this.target.degas.x - this.degas.x) / 200;
		this.degas.y += (this.target.degas.y - this.degas.y) / 200;
	}
	else{
		this.shootTarget();
	}
	
	if( this.degas.x < 0 ){
		this.degas.x = window.innerWidth;
	}
	else if( this.degas.x > window.innerWidth ){
		this.degas.x = 0;
	}  
	
	if( this.degas.y < 0 ){
		this.degas.y = window.innerHeight;
	}
	else if( this.degas.y > window.innerHeight ){ 
		this.degas.y = 0; 
	}
}

Spaceship.prototype.moveToEnd = function(){
	
	if( Villani.distanceBetween( { x: this.degas.x, y: this.degas.y }, { x: this.target.x, y: this.target.y } ) > 0 ){ 
		this.degas.x += (this.target.x - this.degas.x) / 50;
		this.degas.y += (this.target.y - this.degas.y) / 50;
	}
	else{
		this.shootTarget();
	}
	
	if( this.degas.x < 0 ){
		this.degas.x = window.innerWidth;
	}
	else if( this.degas.x > window.innerWidth ){
		this.degas.x = 0;
	}  
	
	if( this.degas.y < 0 ){
		this.degas.y = window.innerHeight;
	}
	else if( this.degas.y > window.innerHeight ){ 
		this.degas.y = 0; 
	}
}

Spaceship.prototype.shootTarget = function(){
	var self = this;
	
	if( this.target.pv > 0 ){
		if( Villani.distanceBetween( { x: this.degas.x, y: this.degas.y }, { x: this.target.degas.x, y: this.target.degas.y } ) < distanceAtk && this.canShoot && this.target.pv > 0 ){ 
			//Shoot
			this.canShoot = false;
			this.target.pv -= this.power;
			
			var b = new Degas.Circle( 0.5 );
			b.x = this.degas.x;
			b.y = this.degas.y;
			b.fill = this.degas.fill; 
			b.owner = this;
			b.target = this.target;
			d.addChild( b );
			bullets.push(b);
			
			
			if( this.target.pv <= 0 ){
				this.target.destroy();
				this.getTarget();
			}

			setTimeout(function(){
				self.canShoot = true;
			}, 250);
		}
	}
	else{
		this.getTarget();
	}
}

Spaceship.prototype.destroy = function(){
	var self = this;
	this.degas.opacity = 0;
	
	window['team'+this.team].splice(window['team'+this.team].indexOf(this), 1);
	window['spaceships'].splice(window['spaceships'].indexOf(this), 1);
}

function end(){
	var circleRadius = window.innerHeight/8;
	
	for( var i = 0; i < spaceships.length; i++ ){
		var x = circleRadius * Math.cos( Math.PI*2/spaceships.length*i ) + window.innerWidth/2;
		var y = circleRadius * Math.sin( Math.PI*2/spaceships.length*i ) + window.innerHeight/2;
		
		spaceships[i].target = { x: x, y: y };
	}
}