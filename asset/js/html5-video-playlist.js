(function($){
	jQuery.fn.html5_video_playlist = function(fn_options){
		var self = this;
		if (typeof this == undefined){
			return;
		}else{
			jQuery(self).attr('id', 'html5-video-playlist');
		}
		self.options = jQuery.extend({
			form_height: '500px',
			form_width: '100%',
			form_video_control_height: '40px',
			form_video_height: '400px',
			form_video_description_height: '100px',
			form_video_list_height: '100px',
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
			},
			auto_play: true,
			auto_next: true,
			show_description: true,
			show_video_list: true
		}, fn_options);
		self.total_video = 0;
		self.loadVideo = function(){
			if (self.total_video >= self.options.video_list.length || self.total_video < 0){
				self.total_video = 0;
			}
			self.form_video.html('');
			self.form_video_show = jQuery('<video />');
			self.form_video_show.css({
				'height': '100%', 
				'width': '100%'
			});
			self.form_video_show.attr('id', 'video-show');
			self.form_video_source = jQuery('<source />');
			self.form_video_source.attr('type', self.options.video_list[self.total_video].type);
			self.form_video_source.attr('src', self.options.video_list[self.total_video].src);
			self.form_video_show.append(self.form_video_source);
			self.form_video_show.append('Your browser does not support HTML5 video.');
			self.form_video.append(self.form_video_show);
			if (self.options.show_description)
			{
				self.form_video_text = jQuery('<div />');
				self.form_video_text.css({
					'height': self.options.form_video_description_height,
					'width': '100%',
					'text-align': 'left',
					'padding-left': '10px'
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
					'display': 'inline-block'
				});
				self.form_video_titlte.text(self.options.video_list[self.total_video].title);
				self.form_video_text.append(self.form_video_titlte);
				self.form_video_description = jQuery('<span />');
				self.form_video_description.css({
					'height': '30px',
					'line-height': '30px',
					'width': '100%',
					'text-align': 'left',
					'font-size': '14px',
					'clear': 'both',
					'display': 'inline-block',
					'font-style': 'italic'
				});
				self.form_video_description.text(self.options.video_list[self.total_video].description);
				self.form_video_text.append(self.form_video_description);
				self.form_video.append(self.form_video_text);
			}
			if (self.options.auto_play){
				self.form_video_show[0].play();
			}
		};
		self.createForm = function(){
			self.main_form = jQuery('<div />');
			self.main_form.css({
				'width': self.options.form_width,
				'height': self.options.form_height,
				'text-align': 'center'
			});
			self.main_form.css(self.options.form_extra_style);
			self.form_video = jQuery('<div />');
			self.form_video.attr('class', 'form-video');
			self.form_video.css({
				'width': '100%',
				'height': self.options.form_video_height
			});
			self.main_form.append(self.form_video);
			self.form_video_list = jQuery('<div />');
			self.form_video_list.css({
				'width': '100%',
				'height': self.options.form_video_list_height,
				'text-align': 'center'
			});
			self.form_video.append(self.form_video_list);
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
				'cursor': 'pointer',
				'z-index': '9999',
				'position': 'relative',
				'background':'url(asset/images/next.png) no-repeat center',
				'width': '16px',
				'height': '16px'
			});
			self.form_control_next.attr('title', 'next');
			self.form_control_next.click(function(){
				self.total_video++;
				self.loadVideo();
			});
			self.form_control.append(self.form_control_next);
			
			/** PAUSE **/
			self.form_control_pause = jQuery('<span />');
			self.form_control_pause.css({
				'float': 'right',
				'margin': '3px',
				'cursor': 'pointer',
				'z-index': '9999',
				'position': 'relative',
				'background':'url(asset/images/pause.png) no-repeat center',
				'width': '16px',
				'height': '16px'
			});
			self.form_control_pause.attr('title', 'pause');
			self.form_control_pause.click(function(){
				self.form_video_show[0].pause();
			});
			self.form_control.append(self.form_control_pause);
			
			/** PLAY **/
			self.form_control_play = jQuery('<span />');
			self.form_control_play.css({
				'float': 'right',
				'margin': '3px',
				'cursor': 'pointer',
				'z-index': '9999',
				'position': 'relative',
				'background':'url(asset/images/play.png) no-repeat center',
				'width': '16px',
				'height': '16px'
			});
			self.form_control_play.attr('title', 'play');
			self.form_control_play.click(function(){
				self.form_video_show[0].play(); 
			});
			self.form_control.append(self.form_control_play);
			
			/** PREV **/
			self.form_control_prev = jQuery('<span />');
			self.form_control_prev.css({
				'float': 'right',
				'margin': '3px',
				'cursor': 'pointer',
				'z-index': '9999',
				'position': 'relative',
				'background':'url(asset/images/prev.png) no-repeat center',
				'width': '16px',
				'height': '16px'
			});
			self.form_control_prev.attr('title', 'prev');
			self.form_control_prev.click(function(){
				self.total_video--;
				self.loadVideo();
			});	
			self.form_control.append(self.form_control_prev);
			
			self.main_form.append(self.form_control);
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
					'margin-top': '60px',
					'border-radius': '60%',
					'-webkit-box-shadow': '0px 0px 5px -1px #2C3D82',
					'-moz-box-shadow': '0px 0px 5px -1px #2C3D82',
					'box-shadow': '0px 0px 5px -1px #2C3D82',
					'-webkit-border-radius': '6px',
					'-moz-border-radius': '6px',
					'border': '1px solid #2C3D82',
					'border-radius': '22px',
					'border-top-right-radius': '0px',
					'border-top-left-radius': '0px',
					'border-right':' none'
				});
				self.prev_video = jQuery('<div />');
				self.prev_video.attr('class', 'prev-video');
				self.prev_video.css({
					'float': 'left',
					'background':'url(asset/images/prev-video-slide.png) no-repeat center',
					'width': '30px',
					'height': '30px',
					'cursor': 'pointer',
					'margin-top': '40px'
				});
				self.prev_video.html('&nbsp;');
				self.slide_video.append(self.prev_video);
				self.list_video = jQuery('<div />');
				self.list_video.css({
					'position': 'relative',
					'float': 'left',
					'height': self.options.form_video_list_height,
					'padding': '0px 8px',
					'width': (self.main_form.width() - 80) + 'px',
					'overflow-x': 'hidden'
				});				
				for(var n = 0; n < self.options.video_list.length; n++){
					var video = jQuery('<div />');
					video.attr('class', 'video-item');
					video.attr('id', 'video-item-'+(n+1));
					video.attr('data-video-id', n);
					video.css({
						'width': '100px',
						'height': self.options.form_video_list_height-5,
						'left': n*100+'px',
						'position': 'absolute',
						'cursor': 'pointer'
					});
					var video_thum = jQuery('<img />');
					video_thum.attr('src', self.options.video_list[n].thumbnail);
					video_thum.css({
						'width': '80px',
						'height': '100px'						
					});
					video.append(video_thum);
					self.list_video.append(video);
					video.click(function(){
						self.total_video = parseInt(jQuery(this).attr('data-video-id'));
						self.loadVideo();
					});					
				}
				self.slide_video.append(self.list_video);
				self.next_video = jQuery('<div />');
				self.next_video.html('&nbsp;');
				self.next_video.attr('class', 'next-video');
				self.next_video.css({
					'float': 'right',
					'background':'url(asset/images/next-video-slide.png) no-repeat center',
					'width': '30px',
					'height': '30px',
					'cursor': 'pointer',
					'margin-top': '40px'
				});
				self.slide_video.append(self.next_video);
				self.main_form.append(self.slide_video);
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
		};
		self.init = function(){
			self.createForm();
			if (self.options.show_video_list){
				self.createFormList();
			}
			self.loadVideo();
		};
		return self;
	};
})(jQuery);