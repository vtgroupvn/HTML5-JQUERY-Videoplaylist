/**
* License: GPLv2 or later
* License URI: http://www.gnu.org/licenses/gpl-2.0.html
* Donate link: http://vt-group.vn/donate.html
**/
(function($){
	"use strict"
	jQuery.fn.html5_video_playlist = function(fn_options){
		var self = this;
		if (typeof this == undefined){
			return;
		}else{
			jQuery(self).attr('class', 'html5-video-playlist');
		}
		self.options = jQuery.extend({
			form_height: '500',
			form_width: '700',
			form_video_control_height: '40',
			form_video_height: '400',
			form_video_description_height: '100',
			form_video_list_height: '100',
			form_video_list_width: '100',
			form_extra_style : {
				'margin': 'auto',
				'margin-top': '200px',
				'border': '1px solid #2C3D82',
				'border-radius': '60%',
				'-webkit-box-shadow': '0px 0px 5px -1px #2C3D82',
				'-moz-box-shadow':    '0px 0px 5px -1px #2C3D82',
				'box-shadow':         '0px 0px 5px -1px #2C3D82',
				'-webkit-border-radius': '6px',
				'-moz-border-radius': '6px',
			},
			video_list:[
				{title: 'video 1', description: 'video 1', src: 'http://vt-gropup.vn', type: 'video/mp4'},
				{title: 'video 1', description: 'video 1', src: 'http://vt-gropup.vn', type: 'video/mp4'},
				{title: 'video 1', description: 'video 1', src: 'http://vt-gropup.vn', type: 'video/mp4'},
				{title: 'video 1', description: 'video 1', src: 'http://vt-gropup.vn', type: 'video/mp4'},
				{title: 'video 1', description: 'video 1', src: 'http://vt-gropup.vn', type: 'video/mp4'}
			],
			get_current_video: function(video){
				//TODO: Process video
			},
			auto_play: true,
			auto_next: true,
			show_description: true,
			show_video_list: true,
			player_color: '#2C3D82',
			player_buffer_color:'#33CCCC',
			skin: 1
		}, fn_options);
		if (!self.options.show_video_list){
			self.options.skin = 1;
		}
		self.draging = false;
		self.draging_volume = false;
		self.currently_active_video = 0;
		self.loadVideo = function(){
			if (self.currently_active_video >= self.options.video_list.length || self.currently_active_video < 0){
				self.currently_active_video = 0;
			}
			self.clearScreenLoading();
			self.video_pause = false;
			self.form_video.html('');
			self.form_video.hide();
			self.form_video_show = jQuery('<video />');
			if (self.options.skin == 1){
				self.form_video_show.css({
					'height': '100%', 
					'width': '100%',
					'cursor': 'pointer'
				});
			}else{
				self.form_video_show.css({
					'height': self.options.form_height - self.options.form_video_description_height, 
					'width': '100%',
					'cursor': 'pointer'					
				});
			}
			self.form_video_show.attr('id', 'video-show');
			self.form_video_source = jQuery('<source />');
			self.form_video_source.attr('type', self.options.video_list[self.currently_active_video].type);
			self.form_video_source.attr('src', self.options.video_list[self.currently_active_video].src);
			self.form_video_show.append(self.form_video_source);
			self.form_video_show.append('Your browser does not support HTML5 video.');
			self.form_video.append(self.form_video_show);
			self.createControl();
			if (self.options.show_description)
			{
				self.form_video_text = jQuery('<div />');
				self.form_video_text.css({
					'height': 'auto',
					'width': '100%',
					'text-align': 'left',
					'margin-top': '-20px',
					'display':'inline-block',
					'color': self.options.player_color
				});
				self.form_video_titlte = jQuery('<span />');
				self.form_video_titlte.css({
					'height': '30px',
					'line-height': '30px',
					'width': '100%',
					'text-align': 'left',
					'font-size': '14px',
					'font-weight': 'bold',
					'clear': 'both',
					'display': 'inline-block',
					'color': self.options.player_color
				});
				self.form_video_titlte.html(self.options.video_list[self.currently_active_video].title);
				self.form_video_text.append(self.form_video_titlte);
				self.form_video_description = jQuery('<span />');
				self.form_video_description.css({
					'height': '30px',
					'line-height': '30px',
					'width': '100%',
					'text-align': 'left',
					'font-size': '14px',
					'clear': 'both',
					'font-style': 'italic',
					'color': self.options.player_color,
					'padding-left':'8px'
				});
				self.form_video_description.html(self.options.video_list[self.currently_active_video].description);
				self.form_video_text.append(self.form_video_description);
				self.form_video.append(self.form_video_text);
			}
			self.resizeFix();
			self.createScreenLoading();
			if (self.options.auto_play){
				self.form_video_show[0].play();
			}
			if (self.options.auto_next){
				self.form_video_show[0].addEventListener("ended", function(e) {
					self.currently_active_video++;
					self.loadVideo();
				});
			}
			self.form_video_show[0].addEventListener('loadedmetadata', function() {
				//display video buffering bar
				var currentBuffer = self.form_video_show[0].buffered.end(0);
				var maxduration = self.form_video_show[0].duration;
				var perc = 100 * currentBuffer / maxduration;
				if (!self.draging){
					self.processbar_show_buffer.css('width',perc+'%');
				}
				self.clearScreenLoading();
			});
			self.form_video_show[0].addEventListener('timeupdate', function(){
				var percentage = Math.floor((100 / self.form_video_show[0].duration) * self.form_video_show[0].currentTime);
				/**START SHOW TIME**/				
				var current_min = parseInt(Math.floor(self.form_video_show[0].currentTime / 60));
				if (isNaN(current_min)){
					current_min = 0;
				}
				var current_second =  parseInt(self.form_video_show[0].currentTime - current_min*60);
				if (isNaN(current_second)){
					current_second = 0;
				}
				var total_min =  parseInt(Math.floor(self.form_video_show[0].duration / 60));
				if (isNaN(total_min)){
					total_min = 0;
				}
				var total_second =  parseInt(self.form_video_show[0].duration - total_min*60);
				if (isNaN(total_second)){
					total_second = 0;
				}
				self.form_control_time.html(current_min+':'+current_second.toFixed(0)+'/'+total_min+':'+total_second.toFixed(0));
				/**END SHOW TIME**/
				if (!self.draging){
					self.processbar_show.css({
						'width': percentage+'%',
						'padding-left': '5px',
						'display': 'block'
					});
				}
				if (!self.draging){
					self.processbar_circle.css({
						'left': (percentage)+'%',
						'display': 'block'
					});
				}
				if (!self.draging_volume && self.seeking_volume_percentage != undefined){
					self.processbar_volume_show.css({
						'width': (100*self.seeking_volume_percentage)+'%'					
					});
					self.processbar_volume_circle.css({
						'left': (100*self.seeking_volume_percentage)+'%',
						'display': 'block'					
					});
				}
				self.clearScreenLoading();
			}, false);
			self.form_video_show[0].addEventListener('loadeddata', function(){
				self.form_video.show();
				self.form_control.show();
				
				self.createOverLayVideo();
				self.form_video_show_overlay.click(function(){
					if(!self.video_pause){
						self.video_pause = true;
						self.form_video_show[0].pause();
						jQuery(self).find('div#video-orverlay-thum').find('img').attr('src', 'asset/images/'+self.options.player_color.replace('#', '')+'-main-video-play.png');						
						self.form_video_show_overlay.find('img').show();
					}else{
						self.video_pause = false;
						self.form_video_show[0].play();
						jQuery(self).find('div#video-orverlay-thum').find('img').attr('src', 'asset/images/'+self.options.player_color.replace('#', '')+'-main-video-pause.png');						
					}
				});
				self.form_video_show_overlay[0].addEventListener("mouseover", function(){
					self.form_video_show_overlay.find('img').show();
				});
				self.form_video_show_overlay.mouseout(function(){
					if(!self.video_pause){
						self.form_video_show_overlay.find('img').hide();
					}
				});
			});
			self.seekingDuration = function(totalWidth, duration){
				var percentage = ( duration / totalWidth );
				var vidTime = self.form_video_show[0].duration * percentage;
				self.form_video_show[0].currentTime = vidTime;
				self.form_video_show[0].play();
			};
			self.processbar_volume_show.css({
				'width': (100*self.form_video_show[0].volume)+'%'					
			});
			self.seekingVolume = function(totalWidth, duration){
				self.seeking_volume_percentage = ( duration / totalWidth );
				self.form_video_show[0].volume  = self.seeking_volume_percentage;
				self.processbar_volume_show.css({
					'width': (100*self.seeking_volume_percentage)+'%'
				});
				self.processbar_volume_circle.css({
					'left': (100*self.seeking_volume_percentage)+'%'		
				});
			}
			if (self.seeking_volume_percentage != undefined){
				self.form_video_show[0].volume  = self.seeking_volume_percentage;
			}
			/**CALLBACK THE EVENT**/
			if (typeof self.options.get_current_video == 'function'){
				self.options.get_current_video(self.form_video_show[0]);
			}
			jQuery(self).find('div.video-hover').hide();
			jQuery(self).find('div#over-video-item-'+(self.currently_active_video+1)).show();
		};
		self.createControl = function(){
			self.form_control = jQuery('<div />');
			self.form_control.css({
				'width': '100%',
				'height': self.options.form_video_control_height,
				'text-align': 'center'
			});
			/** NEXT **/
			self.form_control_next = jQuery('<span />');
			self.form_control_next.css({
				'float': 'right',
				'margin': '3px',
				'margin-right': '0px',
				'cursor': 'pointer',
				'position': 'relative',
				'background':'url(asset/images/'+self.options.player_color.replace('#', '')+'-next.png) no-repeat center',
				'width': '16px',
				'height': '16px'
			});
			self.form_control_next.attr('title', 'next');
			self.form_control_next.click(function(){
				self.currently_active_video++;
				self.loadVideo();
			});
			self.form_control.append(self.form_control_next);
			
			/** PAUSE **/
			self.form_control_pause = jQuery('<span />');
			self.form_control_pause.css({
				'float': 'right',
				'margin': '3px',
				'cursor': 'pointer',
				'position': 'relative',
				'background':'url(asset/images/'+self.options.player_color.replace('#', '')+'-pause.png) no-repeat center',
				'width': '16px',
				'height': '16px'
			});
			self.form_control_pause.attr('title', 'pause');
			self.form_control_pause.click(function(){
				self.video_pause = true;
				self.form_video_show[0].pause();
				jQuery(self).find('div#video-orverlay-thum').find('img').attr('src', 'asset/images/'+self.options.player_color.replace('#', '')+'-main-video-play.png');
				self.form_video_show_overlay.find('img').show();
			});
			self.form_control.append(self.form_control_pause);
			
			/** PLAY **/
			self.form_control_play = jQuery('<span />');
			self.form_control_play.css({
				'float': 'right',
				'margin': '3px',
				'cursor': 'pointer',
				'position': 'relative',
				'background':'url(asset/images/'+self.options.player_color.replace('#', '')+'-play.png) no-repeat center',
				'width': '16px',
				'height': '16px'
			});
			self.form_control_play.attr('title', 'play');
			self.form_control_play.click(function(){
				self.video_pause = false;
				self.form_video_show[0].play(); 
				jQuery(self).find('div#video-orverlay-thum').find('img').attr('src', 'asset/images/'+self.options.player_color.replace('#', '')+'-main-video-pause.png');						
			});
			self.form_control.append(self.form_control_play);
			
			/** PREV **/
			self.form_control_prev = jQuery('<span />');
			self.form_control_prev.css({
				'float': 'right',
				'margin': '3px',
				'cursor': 'pointer',
				'position': 'relative',
				'background':'url(asset/images/'+self.options.player_color.replace('#', '')+'-prev.png) no-repeat center',
				'width': '16px',
				'height': '16px'
			});
			self.form_control_prev.attr('title', 'prev');
			self.form_control_prev.click(function(){
				self.currently_active_video--;
				self.loadVideo();
			});	
			self.form_control.append(self.form_control_prev);
			/**FULLSCREEN**/
			self.form_control_fullscreen = jQuery('<span />');
			self.form_control_fullscreen.css({
				'float': 'right',
				'margin': '3px',
				'cursor': 'pointer',
				'position': 'relative',
				'background':'url(asset/images/'+self.options.player_color.replace('#', '')+'-fullscreen.png) no-repeat center',
				'width': '16px',
				'height': '16px',
				'margin-left':'10px'
			});
			self.form_control_fullscreen.attr('title', 'Full Screen');
			self.form_control_fullscreen.click(function(){
				if (self.form_video_show.css('position') != 'fixed'){
					self.form_video_show.css({
						'position': 'fixed',
						'right': 0, 
						'bottom': 0,
						'min-width': '100%', 
						'min-height': '100%',
						'width': 'auto',
						'height': 'auto',
						'z-index': '999',
						'background-size':'cover'
					});
				}
				self.form_video_show_overlay.css({
					'position': 'fixed',
					'right': 0, 
					'bottom': 0,
					'min-width': '100%', 
					'min-height': '100%',
					'width': 'auto',
					'height': 'auto',
					'z-index': '999',
					'background-size':'cover',
					'top': self.form_video_show.position().top+self.form_video_show.height()/2-250,
					'left': self.form_video_show.position().left,
					'text-align': 'center'
				});
				document.onkeydown = function(evt) {
					evt = evt || window.event;
					var isEscape = false;
					if ("key" in evt) {
						isEscape = (evt.key == "Escape" || evt.key == "Esc");
					} else {
						isEscape = (evt.keyCode == 27);
					}
					if (isEscape) {
						if (self.form_video_show.css('position') == 'fixed'){
							self.form_video_show.css({
								'position': 'inherit',
								'right': 0, 
								'bottom': 0,
								'width': '100%',
								'height': '100%',
								'z-index': '0'
							});
							self.form_video_show_overlay.css({
								'height': self.form_video_show.innerHeight(), 
								'width': self.form_video_show.innerWidth(),
								'cursor': 'pointer',
								'position': 'absolute',
								'display': 'block',
								'top': self.form_video_show.position().top+self.form_video_show.height()/2-200,
								'left': self.form_video_show.position().left,
								'text-align': 'center',
								'min-width': '', 
								'min-height': '',
							});
							if (self.checkBrowser() == 'Firefox'){
								self.form_video_show_overlay.css({
									'top': self.form_video_show.position().top+self.form_video_show.height()/2-250
								});
							}
						}
					}
				};
			});	
			self.form_control.append(self.form_control_fullscreen);
			/**PROCESSBAR VOLUME*/
			self.processbar_volume = jQuery('<div />');
			self.processbar_volume.attr('id', 'progress-bar-volume');
			self.processbar_volume.attr('min', '0');
			self.processbar_volume.attr('max', '100');
			self.processbar_volume.css({
				'float': 'right',
				'color':'#fff',
				'font-size':'12px',
				'width': '80px',
				'height':'3px',
				'border':'none',
				'margin-right':'5px',
				'text-align':'left',
				'position': 'relative',
				'top': '9px',
				'cursor': 'pointer',
				'border': '1px solid '+self.options.player_color,
				'-webkit-box-shadow': '0px 0px 5px -1px '+self.options.player_color,
				'-moz-box-shadow':    '0px 0px 5px -1px '+self.options.player_color,
				'box-shadow':         '0px 0px 5px -1px '+self.options.player_color,
				'-webkit-border-radius': '6px',
				'-moz-border-radius': '6px'
			});
			self.processbar_volume.click(function(e){
				var offset = jQuery(this).offset();
				var left = (e.pageX - offset.left);
				var totalWidth = jQuery(this).width();
				self.seekingVolume(totalWidth, left);
			});
			self.form_control.append(self.processbar_volume);
			self.processbar_volume_show = jQuery('<div />');
			self.processbar_volume_show.css({
				'width': '0px',
				'background':self.options.player_color,
				'height': '4px',
				'display':'inline-block',
				'margin-top': '0px'
			});	
			if (self.checkBrowser() == 'Chrome'){
				self.processbar_volume_show.css({'height': '4px', 'margin-top':'-1px'});
			}
			self.processbar_volume_show.html('&nbsp;');
			self.processbar_volume.append(self.processbar_volume_show);
			/**VOLUME**/
			self.form_control_volume = jQuery('<span />');
			self.form_control_volume.css({
				'float': 'right',
				'margin': '3px',
				'cursor': 'pointer',
				'position': 'relative',
				'background':'url(asset/images/'+self.options.player_color.replace('#', '')+'-volume.png) no-repeat center',
				'width': '16px',
				'height': '16px'
			});
			self.form_control_volume.attr('title', 'volume');
			self.form_control_volume.click(function(){
				self.form_video_show[0].muted = !(self.form_video_show[0].muted);
				if (self.form_video_show[0].muted){
					self.form_control_volume.css({
						'background':'url(asset/images/'+self.options.player_color.replace('#', '')+'-unvolume.png) no-repeat center'
					});
				}else{
					self.form_control_volume.css({
						'background':'url(asset/images/'+self.options.player_color.replace('#', '')+'-volume.png) no-repeat center'
					});
				}
			});
			self.processbar_volume_circle = jQuery('<div />');
			self.processbar_volume_circle.css({
				'background': self.options.player_color,
				'border-radius': '60%',
				'-webkit-box-shadow': '0px 0px 5px -1px '+self.options.player_color,
				'-moz-box-shadow':    '0px 0px 5px -1px '+self.options.player_color,
				'box-shadow':         '0px 0px 5px -1px '+self.options.player_color,
				'height': '8px',
				'width': '8px',
				'display': 'inline-block',
				'position': 'relative',
				'top': '-5px',
				'clear': 'both',
				'border': '2px solid '+self.options.player_color,
				'position': 'absolute',
				'margin-left': '-3px',				
				'cursor': 'pointer',
				'z-index': '99'
			});
			self.processbar_volume_circle.attr('draggable', "true");
			self.processbar_volume.append(self.processbar_volume_circle);
			self.form_control.append(self.form_control_volume);
			/** TIME **/
			self.form_control_time = jQuery('<span />');
			self.form_control_time.css({
				'color':self.options.player_color,
				'float': 'right',
				'margin': '3px',
				'cursor': 'pointer',
				'position': 'relative',
				'width': '40px',
				'height': '16px',
				'font-size': '10px',
				'margin-top': '5px'
			});
			if (self.checkBrowser() == 'Firefox'){
				self.form_control_time.css({'margin-top': '5px'});
			}else{
				self.form_control_time.css({'margin-top': '6px'});
			}
			self.form_control_time.attr('title', 'time');
			self.form_control_time.html('&nbsp;');
			self.form_control.append(self.form_control_time);
			self.processbar = jQuery('<div />');
			self.processbar.attr('id', 'progress-bar');
			self.processbar.attr('min', '0');
			self.processbar.attr('max', '100');
			self.processbar.css({
				'font-size':'12px',
				'width': (self.main_form.width()-16*5-197)+'px',
				'height':'3px',
				'border':'none',
				'margin-right':'5px',
				'text-align':'left',
				'position': 'relative',
				'cursor': 'pointer',
				'top': '9px',
				'cursor': 'pointer',
				'border': '1px solid '+self.options.player_color,
				'-webkit-box-shadow': '0px 0px 5px -1px '+self.options.player_color,
				'-moz-box-shadow':    '0px 0px 5px -1px '+self.options.player_color,
				'box-shadow':         '0px 0px 5px -1px '+self.options.player_color,
				'-webkit-border-radius': '6px',
				'-moz-border-radius': '6px'
			});
			if (self.options.skin > 1){
				self.processbar.css({'width': (self.main_form.width()-16*5-(parseInt(self.options.form_video_list_width) + 200)-10)+'px'});
			}
			self.processbar.click(function(e){
				var offset = jQuery(this).offset();
				var left = (e.pageX - offset.left);
				var totalWidth = jQuery(this).width();
				self.seekingDuration(totalWidth, left);
			});
			self.processbar_show_buffer = jQuery('<div />');
			self.processbar_show_buffer.css({
				'width': '0px',
				'background':self.options.player_buffer_color,
				'height': '3px',
				'display':'inline-block',
				'clear': 'both',
				'margin-top':'0px',
				'opacity': '0.5'
			});
			if (self.checkBrowser() == 'Chrome'){
				self.processbar_show_buffer.css({'height': '4px', 'margin-top':'-1px'});
			}
			if (self.checkBrowser().indexOf('MSIE')){
				self.processbar_show_buffer.css({'height': '3px', 'margin-top':'0px'});
			}
			self.processbar.append(self.processbar_show_buffer);
			self.processbar_show = jQuery('<div />');
			self.processbar_show.css({
				'width': '0px',
				'background': self.options.player_color,
				'height': '4px',
				'display':'inline-block',
				'margin-top': '0px',
				'margin-top': '-4px',
				'position': 'relative'
			});			
			self.processbar_show.html('&nbsp;');
			self.processbar.append(self.processbar_show);
			self.processbar_circle = jQuery('<div />');
			self.processbar_circle.css({
				'background': self.options.player_color,
				'border-radius': '60%',
				'-webkit-box-shadow': '0px 0px 5px -1px '+self.options.player_color,
				'-moz-box-shadow':    '0px 0px 5px -1px '+self.options.player_color,
				'box-shadow':         '0px 0px 5px -1px '+self.options.player_color,
				'height': '8px',
				'width': '8px',
				'display': 'inline-block',
				'position': 'relative',
				'top': '-5px',
				'clear': 'both',
				'border': '2px solid '+self.options.player_color,
				'position': 'absolute',
				'margin-left': '-3px',				
				'cursor': 'pointer',
				'z-index': '99'
			});
			self.processbar_circle.attr('draggable', "true");
			self.processbar.append(self.processbar_circle);
			self.processbar_show_duration = jQuery('<div />');
			self.processbar_show_duration.attr('class', 'processbar-show-duration');
			self.processbar_show_duration.css({
				'display': 'none',
				'position': 'absolute',
				'width': 'auto',
				'height': 'auto',
				'background': '#EEEEEE',
				'border': '1px solid '+self.options.player_color,
				'text-align': 'center',
				'z-index': '9999',
				'color': self.options.player_color
			});
			self.processbar_show_duration_header = jQuery('<span class="icon-hint-arrow-down"/>');
			self.processbar_show_duration_header.css({
				'border-color': 'transparent',
				'border-top-color': self.options.player_color,
				'border-style': 'dashed dashed solid',
				'border-width': '18px 18px',
				'display': 'block',
				'position': 'absolute',							
				'top': '65px',
				'z-index': '99',
				'height': '10px',
				'-webkit-animation': 'gb__a .2s',
				'animation': 'gb__a .2s',
				'background': 'transparent',
				'margin-left':'35px'
			});
			self.processbar_show_duration_header_child = jQuery('<span class="icon-hint-arrow-down-hide" />');
			self.processbar_show_duration_header_child.css({
				'background': 'transparent',
				'border-color': 'transparent',
				'border-top-color': '#EEEEEE',
				'border-style': 'dashed dashed solid',
				'border-width': '23.5px 23.5px',
				'display': 'block',
				'position': 'absolute',
				'left': '-24px',
				'top': '-26px',
				'z-index': '1',
				'height': '0',
				'width': '0',
				'-webkit-animation': 'gb__a .2s',
				'animation': 'gb__a .2s'
			});
			if (self.checkBrowser() == 'Firefox'){
				self.processbar_show_duration_header_child.css({
					'border-width':'23.5px 25.5px',
					'left': '-25px',
				});
			}
			self.processbar_show_duration_header.append(self.processbar_show_duration_header_child);
			self.processbar_show_duration_conteiner = jQuery('<div/>');
			self.processbar_show_duration_conteiner.css({
				'margin': 'auto',
				'text-align': 'center',
				'padding': '25px'
			});
			self.capture_video = jQuery('<video />');
			self.capture_video.css({
				'width': '100px',
				'height': '50px',
				'margin': '-18px'
			});
			self.capture_form_video_source = jQuery('<source />');
			self.capture_form_video_source.attr('type', self.options.video_list[self.currently_active_video].type);
			self.capture_form_video_source.attr('src', self.options.video_list[self.currently_active_video].src);
			self.capture_video.append(self.capture_form_video_source);
			self.capture_video.append('Your browser does not support HTML5 video.');
			self.processbar_show_duration_conteiner.append(self.capture_video);
			self.processbar_show_duration.append(self.processbar_show_duration_header);
			self.processbar_show_duration.append(self.processbar_show_duration_conteiner);
			self.processbar.append(self.processbar_show_duration);
			self.processbar[0].addEventListener("mouseover", function(event){
				self.processbar_show_duration.css({
					'left': event.pageX-270,
					'top': '-90px',
					'display': 'block'
				});
				var offset = self.processbar.offset();
				var left = (event.pageX - offset.left);
				var totalWidth = jQuery(this).width();
				var percentage = ( left / totalWidth );
				var vidTime = self.capture_video[0].duration * percentage;
				self.capture_video[0].currentTime = vidTime;
				self.capture_video[0].muted = true;
				self.capture_video[0].play();
			});
			self.processbar.mouseout(function(){
				self.processbar_show_duration.hide();
			});
			self.form_control.append(self.processbar);
			self.form_video.append(self.form_control);
			self.initDrag();
		};
		self.createForm = function(){
			if (self.options.skin == undefined || self.options.skin > 3 || self.options.skin < 1){
				self.options.skin = 1;
			}
			self.main_form = jQuery('<div />');
			self.main_form.css({
				'width': self.options.form_width,
				'height': self.options.form_height,
				'text-align': 'center'
			});
			self.main_form.css(self.options.form_extra_style);
			if (self.options.skin == 1){
				self.main_video = jQuery('<div />');
				self.main_video.css({
					'width': self.options.form_width,
					'height': self.options.form_height - self.options.form_video_list_height
				});
				if (self.options.show_video_list){
					self.main_video_list = jQuery('<div />');
					self.main_video_list.css({
						'width': '100%',
						'height': self.options.form_video_list_height
					});
				}
				self.main_form.append(self.main_video);
				if (self.options.show_video_list){
					self.main_form.append(self.main_video_list);
				}
			}else if (self.options.skin == 2){
				self.main_video = jQuery('<div />');
				self.main_video.css({
					'width': self.options.form_width-self.options.form_video_list_width-10,
					'height': self.options.form_height - self.options.form_video_list_height,
					'float': 'left',
					'margin-left': '10px'
				});
				if (self.options.show_video_list){
					self.main_video_list = jQuery('<div />');
					self.main_video_list.css({
						'width': self.options.form_video_list_width,
						'height': self.options.form_height,
						'float': 'left'
					});
					self.main_form.append(self.main_video_list);
				}
				self.main_form.append(self.main_video);
			}else if(self.options.skin == 3){
				if (self.options.show_video_list){
					self.main_video_list = jQuery('<div />');
					self.main_video_list.css({
						'width': self.options.form_video_list_width,
						'height': self.options.form_height,
						'float': 'left'
					});
				}
				self.main_video = jQuery('<div />');
				self.main_video.css({
					'width': self.options.form_width-self.options.form_video_list_width-10,
					'height': self.options.form_height,
					'float': 'left',
					'margin-right': '10px'
				});
				self.main_form.append(self.main_video);
				if (self.options.show_video_list){
					self.main_form.append(self.main_video_list);
				}
			}
			self.form_video = jQuery('<div />');
			self.form_video.attr('class', 'form-video');
			self.form_video.css({
				'width': '100%',
				'height': 'auto',
				'display':'inline-block'
			});
			if (self.options.skin > 1){
				self.form_video.css({'height': self.options.form_video_height});
			}
			self.main_video.append(self.form_video);
			self.form_video_list = jQuery('<div />');
			self.form_video_list.css({
				'width': '100%',
				'height': self.options.form_video_list_height,
				'text-align': 'center'
			});
			self.form_video.append(self.form_video_list);			
			jQuery(self).append(self.main_form);
		};
		self.createFormList = function(){
			if (self.options.video_list.length > 0){
				self.slide_video = jQuery('<div />');
				self.slide_video.css({
					'width': '100%',
					'height': self.options.form_video_list_height,
					'text-align': 'center',
					'position': 'relative',
					'border-radius': '22px',
					'border-top-right-radius': '0px',
					'border-top-left-radius': '0px',
					'border-right':'none',
					'display':'inline-block'
				});
				if (self.options.skin == 1){
					self.prev_video = jQuery('<div />');
					self.prev_video.attr('class', 'prev-video');
					self.prev_video.css({
						'float': 'left',
						'background':'url(asset/images/'+self.options.player_color.replace('#', '')+'-prev-video-slide.png) no-repeat center',
						'width': '30px',
						'height': '30px',
						'cursor': 'pointer',
						'margin-top': '40px'
					});
					self.prev_video.html('&nbsp;');
					self.slide_video.append(self.prev_video);
				}else{
					self.slide_video.css({'height':'100%', 'margin-top': '0px'});
				}
				self.list_video = jQuery('<div />');
				if (self.options.skin == 1){
					self.list_video.css({
						'position': 'relative',
						'float': 'left',
						'height': self.options.form_video_list_height,
						'padding': '0px 8px',
						'width': (self.main_form.width() - 80) + 'px',
						'overflow-x': 'hidden',
						'overflow-y': 'hidden'
					});
				}else{
					self.list_video.css({
						'float': 'left',
						'height': '100%',
						'width': self.options.form_video_list_width + 'px',
						'overflow-x': 'hidden',
						'overflow-y': 'scroll'
					});
				}				
				for(var n = 0; n < self.options.video_list.length; n++){
					var video = jQuery('<div />');
					video.attr('class', 'video-item');
					video.attr('id', 'video-item-'+(n+1));
					video.attr('data-video-id', n);
					if (self.options.skin == 1){
						video.css({
							'width': '100px',
							'height': self.options.form_video_list_height,
							'left': n*100+'px',
							'position': 'absolute',
							'cursor': 'pointer',
							'margin': '0px 3px',
							'display': 'inline-block',
							'text-align': 'center'
						});
					}else{
						video.css({
							'width': self.options.form_video_list_width,
							'height': '100px',
							'position': 'relative',
							'cursor': 'pointer',
							'float': 'none',
							'margin-bottom': '10px',
							'display': 'inline-block',
							'text-align': 'center'
						});

					}
					var video_thum = jQuery('<img />');
					video_thum.attr('src', self.options.video_list[n].thumbnail);
					video_thum.attr('alt', self.options.video_list[n].description);
					video_thum.css({
						'width': '80px',
						'height': '100px',
						'-webkit-border-radius': '8px',
						'-moz-border-radius': '8px',
						'margin-top':'2px'
					});
					video.append(video_thum);
					var div_over = jQuery('<div />');
					div_over.attr('class', 'video-hover');
					div_over.attr('id', 'over-video-item-'+(n+1));
					if (self.options.skin == 1){
						div_over.css({
							'position':'relative',
							'width': '100px',
							'height': '0px',
							'margin-top':'-100px',
							'cursor': 'pointer',
							'margin': '0px 3px',
							'display': 'inline-block',
							'text-align': 'center',
							'opacity': 0.8,
							'display':'none',
							'top': '-85px'
						});
					}else{
						div_over.css({
							'position':'relative',
							'width': self.options.form_video_list_width,
							'height': '0px',
							'top':'-85px',
							'cursor': 'pointer',
							'float': 'none',
							'margin-bottom': '10px',
							'display': 'inline-block',
							'text-align': 'center',
							'opacity': 0.8,
							'display':'none'
						});
					}
					video[0].addEventListener("mouseover", function(){
						jQuery(self).find('div.video-hover').hide();
						jQuery(this).find('div.video-hover').css({
							'height': '100px'
						}).show();
					})
					jQuery(self).find('div.video-item').mouseout(function(){
						jQuery(this).find('div.video-hover').css({
							'height': '0px'
						}).hide();
						jQuery(self).find('div#over-video-item-'+(self.currently_active_video+1)).show();
					});
					var overlay_img = jQuery('<img />');
					overlay_img.attr('src', 'asset/images/'+self.options.player_color.replace('#', '')+'-play-button.png');
					overlay_img.attr('width', '40px');
					overlay_img.attr('height', '40px');
					overlay_img.css({'margin-top':'15px'});
					div_over.append(overlay_img);
					video.append(div_over);					
					self.list_video.append(video);
					video.click(function(){
						self.currently_active_video = parseInt(jQuery(this).attr('data-video-id'));
						self.loadVideo();
					});
				}
				self.slide_video.append(self.list_video);
				if (self.options.skin == 1){
					self.next_video = jQuery('<div />');
					self.next_video.html('&nbsp;');
					self.next_video.attr('class', 'next-video');
					self.next_video.css({
						'float': 'right',
						'background':'url(asset/images/'+self.options.player_color.replace('#', '')+'-next-video-slide.png) no-repeat center',
						'width': '30px',
						'height': '30px',
						'cursor': 'pointer',
						'margin-top': '40px'
					});
					self.slide_video.append(self.next_video);
				}
				if (self.options.skin == 1){
					self.prev_video.click(function(){
						var total_video = jQuery(self).find('div.video-item').length;
						if (jQuery('#video-item-'+total_video).position().left <= 0){
							jQuery(self).find('div.video-item').each(function(n){
								jQuery(this).css({
									'left': (self.slide_video.width()+n*100)+'px'
								});
							});
						}else{
							jQuery(self).find('div.video-item').each(function(n){
								jQuery(this).css({
									'left': (jQuery(this).position().left-100)+'px'
								});
							});
						}
					});
					self.next_video.click(function(){
						var total_video = jQuery(self).find('div.video-item').length;
						if (jQuery('#video-item-1').position().left >= ((self.main_form.width() - 60))){
							jQuery(self).find('div.video-item').each(function(n){
								jQuery(this).css({
									'left': ((n-total_video+1)*100)+'px'
								});
							});
						}else{
							jQuery(self).find('div.video-item').each(function(n){
								jQuery(this).css({
									'left': (jQuery(this).position().left+100)+'px'
								});
							});
						}
					});
				}
				self.main_video_list.append(self.slide_video);
			}
		};
		self.add_new_video = function(video_details)
		{
			if (video_details.title == undefined || video_details.description == undefined || video_details.thumbnail == undefined || video_details.type == undefined){
				alert('Error Data Input');
				return;
			}
			self.options.video_list.push(video_details);
			if (!self.options.show_video_list){
				return;
			}
			var video = jQuery('<div />');
			video.attr('class', 'video-item');
			video.attr('id', 'video-item-'+(self.options.video_list.length));
			video.attr('data-video-id', self.options.video_list.length-1);
			if (self.options.skin == 1){
				video.css({
					'width': '100px',
					'height': self.options.form_video_list_height-5,
					'left': (self.options.video_list.length-1)*100+'px',
					'position': 'absolute',
					'cursor': 'pointer',
					'margin': '0px 3px',
					'display': 'inline-block',
					'text-align': 'center'
				});
			}else{
				video.css({
					'width': self.options.form_video_list_width,
					'height': '100px',
					'position': 'relative',
					'cursor': 'pointer',
					'float': 'none',
					'margin-bottom': '10px',
					'display': 'inline-block',
					'text-align': 'center'
				});

			}
			var video_thum = jQuery('<img />');
			video_thum.attr('src', self.options.video_list[self.options.video_list.length-1].thumbnail);
			video_thum.attr('alt', self.options.video_list[self.options.video_list.length-1].description);
			video_thum.css({
				'width': '80px',
				'height': '100px',
				'-webkit-border-radius': '8px',
				'-moz-border-radius': '8px',
				'margin-top':'2px'
			});
			video.append(video_thum);
			var div_over = jQuery('<div />');
			div_over.attr('class', 'video-hover');
			div_over.attr('id', 'over-video-item-'+(self.options.video_list.length));
			if (self.options.skin == 1){
				div_over.css({
					'position':'relative',
					'width': '100px',
					'height': '0px',
					'margin-top':'-100px',
					'cursor': 'pointer',
					'margin': '0px 3px',
					'display': 'inline-block',
					'text-align': 'center',
					'opacity': 0.8,
					'display':'none',
					'top': '-85px'
				});
			}else{
				div_over.css({
					'position':'relative',
					'width': self.options.form_video_list_width,
					'height': '0px',
					'top':'-85px',
					'cursor': 'pointer',
					'float': 'none',
					'margin-bottom': '10px',
					'display': 'inline-block',
					'text-align': 'center',
					'opacity': 0.8,
					'display':'none'
				});
			}
			
			var overlay_img = jQuery('<img />');
			overlay_img.attr('src', 'asset/images/'+self.options.player_color.replace('#', '')+'-play-button.png');
			overlay_img.attr('width', '40px');
			overlay_img.attr('height', '40px');
			overlay_img.css({'margin-top':'15px'});
			div_over.append(overlay_img);
			video.append(div_over);
			self.list_video.append(video);
			video[0].addEventListener("mouseover", function(){
				jQuery(self).find('div.video-hover').hide();
				jQuery(this).find('div.video-hover').css({
					'height': '100px'
				}).show();
			})
			jQuery(self).find('div.video-item').mouseout(function(){
				jQuery(this).find('div.video-hover').css({
					'height': '0px'
				}).hide();
				jQuery(self).find('div#over-video-item-'+(self.currently_active_video+1)).show();
			});
			video.click(function(){
				self.currently_active_video = parseInt(jQuery(this).attr('data-video-id'));
				self.loadVideo();
			});
		}
		self.initDrag = function(){
			self.processbar_circle[0].addEventListener("dragstart", function(event) {
				self.draging = true;
				event.dataTransfer.setData("Text", event.target.id);
				
				var crt = this.cloneNode(true);
				crt.style.display = "none";
				document.body.appendChild(crt);
				event.dataTransfer.setDragImage(crt, 0, 0);
			}, false);
			self.processbar_volume_circle[0].addEventListener("dragstart", function(event) {
				self.draging_volume = true;
				event.dataTransfer.setData("Text", event.target.id);
				
				var crt = this.cloneNode(true);
				crt.style.display = "none";
				document.body.appendChild(crt);
				event.dataTransfer.setDragImage(crt, 0, 0);
			}, false);			
			document.addEventListener("drop", function(event) {			
				event.preventDefault();
				if (self.draging && self.mouseInDuration(event.pageX)){
					self.draging = false;
					var position = self.processbar.position();
					var left = (event.pageX - position.left);
					var totalWidth = self.processbar.width();
					
					self.processbar_circle.css({
						'left': left + 'px',
						'display':'block' 
					});
					self.seekingDuration(totalWidth, left);
				}
				if (self.processbar_circle.css('display') == 'none'){
					self.processbar_circle.css({
						'display':'block' 
					});
				}
				if (self.draging_volume && self.mouseInVolume(event.pageX)){
					self.draging_volume = false;
					var position = self.processbar_volume.position();
					var left = (event.pageX - position.left);
					var totalWidth = self.processbar_volume.width();
					
					self.processbar_volume_circle.css({
						'left': left + 'px',
						'display':'block' 
					});
					self.seekingVolume(totalWidth, left);
				}
				if (self.processbar_volume_circle.css('display') == 'none'){
					self.processbar_volume_circle.css({
						'display':'block' 
					});
				}
			}, false);
			document.addEventListener("dragover", function(event) {
				event.preventDefault();
				if (self.draging){
					if (self.mouseInDuration(event.pageX)){
						var offset = self.processbar.offset();
						var duration = (event.pageX - offset.left);
						var totalWidth = self.processbar.width();
						self.processbar_circle.css({
							'display':'none'
						});
						var percentage = 100*( duration / totalWidth );
						if (percentage <= 100){		
							self.processbar_show.css({
								'width': percentage+'%',
								'padding-left': '5px',
								'z-index': '1',
								'display': 'block'
							});
						}
						var offset = self.processbar.offset();
						var left = (event.pageX - offset.left);
						var totalWidth = jQuery(this).width();
						self.seekingDuration(totalWidth, left);
					}
				}
				if (self.draging_volume){
					if (self.mouseInVolume(event.pageX)){
						var offset = self.processbar_volume.offset();
						var duration = (event.pageX - offset.left);
						var totalWidth = self.processbar_volume.width();
						self.processbar_volume_circle.css({
							'display':'none'
						});
						var percentage = 100*( duration / totalWidth );
						if (percentage <= 100){		
							self.processbar_volume_show.css({
								'width': percentage+'%',
								'padding-left': '5px',
								'z-index': '1',
								'display': 'block'
							});
						}
						var offset = self.processbar_volume.offset();
						var left = (event.pageX - offset.left);
						var totalWidth = self.processbar_volume.width();
						self.seekingVolume(totalWidth, left);
					}
				}
			}, false);
			self.processbar[0].addEventListener("dragover", function(event) {
				event.preventDefault();
				var offset = self.processbar.offset();
				var duration = (event.pageX - offset.left);
				var totalWidth = self.processbar.width();
				self.processbar_circle.css({
					'display':'none'
				});
				var percentage = 100*( duration / totalWidth );
				if (percentage <= 100){		
					self.processbar_show.css({
						'width': percentage+'%',
						'padding-left': '5px',
						'z-index': '1',
						'display': 'block'
					});
				}
				if (self.mouseInDuration(event.pageX)){
					var offset = self.processbar.offset();
					var left = (event.pageX - offset.left);
					var totalWidth = jQuery(this).width();
					self.seekingDuration(totalWidth, left);
				}
			}, false);
			self.processbar_volume[0].addEventListener("dragover", function(event) {
				var offset = self.processbar_volume.offset();
				var duration = (event.pageX - offset.left);
				var totalWidth = self.processbar_volume.width();
				self.processbar_volume_circle.css({
					'display':'none'
				});
				var percentage = 100*( duration / totalWidth );
				if (percentage <= 100){		
					self.processbar_volume_show.css({
						'width': percentage+'%',
						'padding-left': '5px',
						'z-index': '1',
						'display': 'block'
					});
				}
				if (self.mouseInVolume(event.pageX)){
					var offset = self.processbar_volume.offset();
					var left = (event.pageX - offset.left);
					var totalWidth = self.processbar_volume.width();
					self.seekingVolume(totalWidth, left);
				}
			}, false);
		};
		self.resizeFix = function(){
			self.form_video.css({'display':'inline-block'});
			if (self.options.skin > 1)
			{				
				jQuery(self).css({
					'clear': 'both',
					'display': 'inline-block',
					'text-align': 'center'
				});
				if (self.options.show_video_list){
					if (self.options.show_description){
						self.slide_video.css({
							'height': self.main_video.height()+self.form_video_text.height()+50
						});
					}else{
						self.slide_video.css({
							'height': self.main_video.height()+50
						});
					}
				}
				if (self.options.show_description){
					self.main_form.css({
						'height': self.main_video.height()+self.form_video_text.height()+50
					});
				}else{
					self.main_form.css({
						'height': self.main_video.height()+50
					});
				}
				
				jQuery(self).css({'display': 'block'});
			}
		};
		self.compile = function(){
			self.createForm();
			if (self.options.show_video_list){
				self.createFormList();
			}
			self.loadVideo();			
			self.resizeFix();
		};
		self.mouseInVolume = function(x){
			var divRect = self.processbar_volume;
			var left = divRect.position().left;
			var right = divRect.position().left + divRect.width();
		
			if (x >= left && x <= right){
				return true;				
			}
			return false;
		}
		self.mouseInDuration = function(x){
			var divRect = self.processbar;
			var left = divRect.position().left;
			var right = divRect.position().left + divRect.width();
		
			if (x >= left && x <= right){
				return true;				
			}
			return false;
		}
		self.mouseInDrag = function(x, y){
			var divRect = self.processbar;
			var left = divRect.position().left;
			var right = divRect.position().left + divRect.width();
			var top = divRect.position().top;
			var bottom = divRect.position().top + divRect.height();
			
			if (x >= left && x <= right && y >= top && y <= bottom){
				return true;				
			}
			return false;
		}
		self.checkBrowser = function(){
			var c = navigator.userAgent.search("Chrome");
			var f = navigator.userAgent.search("Firefox");
			var m8 = navigator.userAgent.search("MSIE 8.0");
			var m9 = navigator.userAgent.search("MSIE 9.0");
			if (c > -1) {
				var browser = "Chrome";
			} else if (f > -1) {
				var browser = "Firefox";
			} else if (m9 > -1) {
				var browser ="MSIE 9.0";
			} else if (m8 > -1) {
				var browser ="MSIE 8.0";
			}
			return browser;
		};
		self.createOverLayVideo = function(){
			self.form_video_show_overlay = jQuery('<div />');
			self.form_video_show_overlay.attr('id', 'video-orverlay-thum');
			self.form_video_show_overlay.css({
				'height': self.form_video_show.height(), 
				'width': self.form_video_show.width(),
				'cursor': 'pointer',
				'position': 'absolute',
				'display': 'block',
				'top': self.form_video_show.position().top+self.form_video_show.height()/2-250,
				'left': self.form_video_show.position().left,
				'text-align': 'center'
			});
			if (self.options.skin > 1){
				self.form_video_show_overlay.css({'top': self.form_video_show.position().top+self.form_video_show.height()/2-215});
			}
			var video_overlay_thum = jQuery('<img />');
			video_overlay_thum.attr('src', 'asset/images/'+self.options.player_color.replace('#', '')+'-main-video-pause.png');
			video_overlay_thum.attr('width', '80px');
			video_overlay_thum.attr('height', '80px');
			video_overlay_thum.css({'margin-top':self.form_video_show.height()/2-50});
			video_overlay_thum.css({'display':'none'});
			self.form_video_show_overlay.append(video_overlay_thum);
			jQuery(self).append(self.form_video_show_overlay);
		};
		self.createScreenLoading = function()
		{
			var bg_load = jQuery('<div />');
			bg_load.attr('id', 'pre-load');
			bg_load.css({
				'position': 'absolute',
				'width': self.main_form.width(),
				'height': self.form_video.height(),
				'opacity': 1,
				'top': self.main_form.offset().top,
				'left': self.main_form.offset().left
			});
			if (self.options.skin == 2){
				bg_load.css({
					'position': 'absolute',
					'width': self.form_video.width(),
					'height': self.form_video.height(),
					'opacity': 1,
					'top': self.main_form.offset().top,
					'left': self.main_form.offset().left+parseInt(self.options.form_video_list_width)+17
				});
			}
			if (self.options.skin == 3){
				bg_load.css({
					'position': 'absolute',
					'width': self.form_video.width(),
					'height': self.form_video.height(),
					'opacity': 1,
					'top': self.main_form.offset().top,
					'left': self.main_form.offset().left
				});
			}
			var container_load = jQuery('<div />');
			container_load.css({
				'background': '#FFF',
				'width': '70px',
				'height': '70px',
				'position': 'absolute',
				'-webkit-box-shadow': '0px 0px 3px 0px '+self.options.player_color,
				'-moz-box-shadow':    '0px 0px 3px 0px '+self.options.player_color,
				'box-shadow':         '0px 0px 3px 0px '+self.options.player_color,
				'-webkit-border-radius': '6px',
				'-moz-border-radius': '6px',
				'left': self.main_form.position().left+(self.main_form.width()/2) - 35,
				'top': jQuery(self).position().top-15,
				'text-align': 'center'
			});
			if (self.options.skin == 2){
				container_load.css({'left': self.main_form.position().left+(self.main_form.width()/2)-120});
			}
			if (self.options.skin == 3){
				container_load.css({'left': self.main_form.position().left+(self.main_form.width()/2)-90});
			}
			var container_img = jQuery('<img />');
			container_img.attr('src', 'asset/images/'+self.options.player_color.replace('#', '')+'-ajax-loader.gif');
			container_img.attr('width', '50px');
			container_img.css({'margin-top':'10px'});
			container_load.append(container_img);
			bg_load.append(container_load);
			jQuery(self).append(bg_load);
		}
		self.clearScreenLoading = function()
		{
			if (jQuery(self).find('div#pre-load').length > 0){
				jQuery(self).find('div#pre-load').remove();
			}
		}
		return self;
	};
})(jQuery);