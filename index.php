<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title>JQUERY & HTML5 Videoplaylist</title>
<script type="text/javascript" src="asset/js/jquery-3.2.1.min.js"></script>
<script type="text/javascript" src="asset/js/html5-video-playlist.js"></script>
<script type="text/javascript">
	<?php 
		error_reporting(0);
		$skin = (int) $_REQUEST['select_skin'];
		if ($skin > 3 || $skin < 0){
			$skin = 1;
		}
	?>
	jQuery(document).ready(function(){
		var player_color = '#2C3D82';
		var fn_html5_videoplaylist = jQuery('div#html5-videoplaylist-demo').html5_video_playlist({
			form_height: 'auto',
			form_width: '900',
			form_video_control_height: '40',
			form_video_height: '400',
			form_video_description_height: '100',
			form_video_list_height: '100',
			form_video_list_width: '120',
			form_extra_style : {
				'margin': 'auto',
				'margin-top': '20px',
				'border': '1px solid '+player_color,
				'border-radius': '60%',
				'-webkit-box-shadow': '0px 0px 1px 2px '+player_color,
				'-moz-box-shadow':    '0px 0px 1px 2px '+player_color,
				'box-shadow':         '0px 0px 1px 2px '+player_color,
				'-webkit-border-radius': '6px',
				'-moz-border-radius': '6px',
				'padding': '10px'
			},
			video_list:[			
				{title: 'Despacito', description: 'Despacito', thumbnail:'asset/images/1.png', src: 'asset/videos/Despacito.mp4', type: 'video/mp4'},
				{title: 'Reloi Cao Thai Son', description: 'Reloi Cao Thai Son', thumbnail:'asset/images/2.png', src: 'asset/videos/reloi.MP4', type: 'video/mp4'},
				{title: 'Phia sau mot co gai', description: 'Phia sau mot co gai', thumbnail:'asset/images/3.png', src: 'asset/videos/PhiaSauMotCoGai.mp4', type: 'video/mp4'}
			],
			get_current_video: function(video){
				//TODO: Process video
			},
			auto_play: true,
			auto_next: true,
			show_description: true,
			show_video_list: true,
			player_color: player_color,
			player_buffer_color:'#33CCCC',
			skin: <?php echo $skin;?>,//[1,2,3]-have 3 skin
		});
		fn_html5_videoplaylist.init();
		fn_html5_videoplaylist.add_new_video({title: 'Despacito', description: 'Despacito', thumbnail:'asset/images/1.png', src: 'asset/videos/Despacito.mp4', type: 'video/mp4'});
	});
</script>
</head>
<body>
<form action="index.php" method="post">
<center><img src="asset/images/jquery-plugins.jpg" alt="jQuery Plugins"/></center>
<center>
	<select name="select_skin" onChange="this.form.submit();">
		<option value="0" selected="selected">--Select Skin--</option>
		<option value="1" <?php if ($skin == 1){echo 'selected="selected"';}?>>TOP to BOTTOM</option>
		<option value="2" <?php if ($skin == 2){echo 'selected="selected"';}?>>LEFT to RIGHT</option>
		<option value="3" <?php if ($skin == 3){echo 'selected="selected"';}?>>RIGHT to LEFT</option>
	</select>
</center>
<div id="html5-videoplaylist-demo"></div>
</form>
</body>
</html>
