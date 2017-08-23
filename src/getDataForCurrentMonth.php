<?php

require_once("db.php");

setlocale(LC_ALL, 'ita', 'it_IT');
date_default_timezone_set("Europe/Rome");


$GeoPolygonsName = "Distretti";
$GeoPolygonFiles = [  
	"/GeoJSON/Distretti.geojson"
];
$GeoPointsName = "Venues";
$GeoPointFiles = [   
	 "/GeoJSON/Arene-piazze-parchi.geojson"  ,
	 "/GeoJSON/teatri-sale-concerto.geojson"  ,
	 "/GeoJSON/venues.geojson" 
];


$interval = "1 MONTH";


$months = [ 'Gennaio','Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', "Settembre", 'Ottobre', 'Novembre', 'Dicembre'     ];

$month = $months[intval(date("n"))-2];
$year = intval(date("Y"));
if($month<0){
	$month = 11;
	$year = $year - 1;
}



if(isset( $argv[1] )){  //$_REQUEST["researches"])){

	$prefix = "" . $month . "-" . $year;

	$dirname = dirname( dirname(__FILE__) ) . "/" . $prefix;
	$fileprefix = $dirname . "/report-";


	if(!file_exists($dirname)){
		mkdir($dirname);
	}
	
	$researcharray = explode(",", $argv[1] ); //$_REQUEST["researches"]  );

	$timecondition = "created_at > DATE_SUB(CURDATE(), INTERVAL " . $interval . " ) ";
	$researchidcondition = "research_id IN ( " . (  implode(",", $researcharray)  ) . " ) ";



	// -------------------------------------------------------
	// -------------------------------------------------------
	// Number of users and Number of messages
	$fname = $fileprefix . "number_users_and_messages.json";
	$result1 = new \stdClass();
	$result1->nusers = 0;
	$result1->nmessages = 0;
	$result1->fromdate = null;
	$result1->todate = null;
	$result1->month = ucfirst($month);
	$result1->year = $year;

	$q1 = "SELECT count(*) as n, min(created_at) as mindate, max(created_at) as maxdate FROM contents c WHERE c." . $researchidcondition . " AND c." . $timecondition;
	$r1 = $pdo->query( $q1 );
	if($r1){
		foreach ($r1 as $row) {
			//print_r($row);
			$result1->nmessages = intval($row["n"]);
			$result1->fromdate = $row["mindate"];
			$result1->todate = $row["maxdate"];
		}
		$r1->closeCursor();
	}
	$q1 = "SELECT count(*) as n FROM ( SELECT DISTINCT subject_id as s FROM contents c WHERE c." . $researchidcondition . " AND c." . $timecondition . " ) a";
	$r1 = $pdo->query( $q1 );
	if($r1){
		foreach ($r1 as $row) {
			//print_r($row);
			$result1->nusers = intval($row["n"]);
		}
		$r1->closeCursor();
	}
	if(file_exists($fname)){
		unlink($fname);
	}
	$fp = fopen($fname, 'w');
	fwrite($fp, json_encode($result1));
	fclose($fp);
	// Number of users and Number of messages
	// -------------------------------------------------------
	// -------------------------------------------------------



	// -------------------------------------------------------
	// -------------------------------------------------------
	// Geographic Distribution
	$fname = $fileprefix . "geo_distribution.json";
	$result1 = new \stdClass();
	$result1->data = array();

	$q1 = "SELECT  lat,lng,count(*) as c FROM contents c WHERE c." . $researchidcondition . " AND c." . $timecondition . " GROUP BY lat,lng";
	$r1 = $pdo->query( $q1 );
	if($r1){
		foreach ($r1 as $row) {
			//print_r($row);
			$o = new \stdClass();
			$o->c = floatval($row["c"]);
			$o->lat = floatval($row["lat"]);
			$o->lng = floatval($row["lng"]);

			$result1->data[] = $o;
		}
		$r1->closeCursor();
	}
	if(file_exists($fname)){
		unlink($fname);
	}
	$fp = fopen($fname, 'w');
	fwrite($fp, json_encode($result1));
	fclose($fp);
	// Geographic Distribution
	// -------------------------------------------------------
	// -------------------------------------------------------






	// -------------------------------------------------------
	// -------------------------------------------------------
	// Emotion List
	$fname = $fileprefix . "emotion_list.json";
	$result1 = new \stdClass();
	$result1->emotions = array();
	
	$result1->CPositiveEPositive = new \stdClass();
	$result1->CPositiveEPositive->r = 0;
	$result1->CPositiveEPositive->g = 255;
	$result1->CPositiveEPositive->b = 0;

	$result1->CPositiveENegative = new \stdClass();
	$result1->CPositiveENegative->r = 0;
	$result1->CPositiveENegative->g = 0;
	$result1->CPositiveENegative->b = 255;

	$result1->CNegativeENegative = new \stdClass();
	$result1->CNegativeENegative->r = 255;
	$result1->CNegativeENegative->g = 0;
	$result1->CNegativeENegative->b = 0;

	$result1->CNegativeEPositive = new \stdClass();
	$result1->CNegativeEPositive->r = 255;
	$result1->CNegativeEPositive->g = 0;
	$result1->CNegativeEPositive->b = 255;


	$pp = 0;
	$pn = 0;
	$nn = 0;
	$np = 0;

	$q1="SELECT id,label,comfort,energy FROM emotion_types ORDER BY comfort DESC, energy DESC";
	$r1 = $pdo->query( $q1 );
	if($r1){

		foreach ($r1 as $row) {

			$o = new \stdClass();
			$o->id = $row["id"];
			$o->label = $row["label"];
			$o->comfort = $row["comfort"];
			$o->energy = $row["energy"];
			if(  $o->comfort>=0 && $o->energy>=0 ){
				$o->type = "pp";
				$pp++;
			} else if(  $o->comfort>=0 && $o->energy<0 ){
				$o->type = "pn";
				$pn++;
			} else if(  $o->comfort<0 && $o->energy<0 ){
				$o->type = "nn";
				$nn++;
			} else{
				$o->type = "np";
				$np++;
			}
			$result1->emotions[] = $o;
		}
		$r1->closeCursor();
	}

	$dpp = 200/$pp;
	$dpn = 200/$pn;
	$dnn = 200/$nn;
	$dnp = 200/$np;

	$cpp = 0;
	$cpn = 0;
	$cnn = 0;
	$cnp = 0;

	for($i=0; $i<count($result1->emotions); $i++){
		if( $result1->emotions[$i]->type=="pp"  ){
			$result1->emotions[$i]->r = max(0,round($result1->CPositiveEPositive->r - $dpp*$cpp));
			$result1->emotions[$i]->g = max(0,round($result1->CPositiveEPositive->g - $dpp*$cpp));
			$result1->emotions[$i]->b = max(0,round($result1->CPositiveEPositive->b - $dpp*$cpp));
			$cpp++;
		} else if( $result1->emotions[$i]->type=="pn"  ){
			$result1->emotions[$i]->r = max(0,round($result1->CPositiveENegative->r - $dpn*$cpn));
			$result1->emotions[$i]->g = max(0,round($result1->CPositiveENegative->g - $dpn*$cpn));
			$result1->emotions[$i]->b = max(0,round($result1->CPositiveENegative->b - $dpn*$cpn));
			$cpn++;
		} else if( $result1->emotions[$i]->type=="nn"  ){
			$result1->emotions[$i]->r = max(0,round($result1->CNegativeENegative->r - $dnn*$cnn));
			$result1->emotions[$i]->g = max(0,round($result1->CNegativeENegative->g - $dnn*$cnn));
			$result1->emotions[$i]->b = max(0,round($result1->CNegativeENegative->b - $dnn*$cnn));
			$cnn++;
		} else{
			$result1->emotions[$i]->r = max(0,round($result1->CNegativeEPositive->r - $dnp*$cnp));
			$result1->emotions[$i]->g = max(0,round($result1->CNegativeEPositive->g - $dnp*$cnp));
			$result1->emotions[$i]->b = max(0,round($result1->CNegativeEPositive->b - $dnp*$cnp));
			$cnp++;
		}
		
	}
	

	if(file_exists($fname)){
		unlink($fname);
	}
	$fp = fopen($fname, 'w');
	fwrite($fp, json_encode($result1));
	fclose($fp);
	// Emotion List
	// -------------------------------------------------------
	// -------------------------------------------------------
	




	// -------------------------------------------------------
	// -------------------------------------------------------
	// Sentiment %
	$fname = $fileprefix . "sentiment_percent.json";
	$result1 = new \stdClass();
	$result1->positive = 0;
	$result1->negative = 0;
	$result1->neutral = 0;

	$negative_threshold = 20;

	$q1 = "SELECT  comfort, energy FROM contents c WHERE c." . $researchidcondition . " AND c." . $timecondition . " ";
	$r1 = $pdo->query( $q1 );
	if($r1){
		foreach ($r1 as $row) {
					if($row["comfort"] > $negative_threshold){
						$result1->positive = $result1->positive + 1;
					} else if($row["comfort"] < -$negative_threshold){
						$result1->negative = $result1->negative + 1;
					} else {
						$result1->neutral = $result1->neutral + 1;
					}
		}
		$r1->closeCursor();
	}
	if(file_exists($fname)){
		unlink($fname);
	}
	$fp = fopen($fname, 'w');
	fwrite($fp, json_encode($result1));
	fclose($fp);
	// Sentiment %
	// -------------------------------------------------------
	// -------------------------------------------------------




	// -------------------------------------------------------
	// -------------------------------------------------------
	// Sentiment timeline
	$fname = $fileprefix . "sentiment_timeline.json";
	$result1 = new \stdClass();
	$result1->positive = array();
	$result1->negative = array();
	$result1->neutral = array();

	$negative_threshold = 20;


	//positive
	$q1 = "SELECT  YEAR(created_at) y, MONTH(created_at) m , DAY(created_at) d, count(*) c FROM contents c WHERE c." . $researchidcondition . " AND c." . $timecondition . " AND c.comfort >" . $negative_threshold . " GROUP BY YEAR(created_at) , MONTH(created_at), DAY(created_at)  ORDER BY created_at ASC";

	$r1 = $pdo->query( $q1 );
	if($r1){
		foreach ($r1 as $ce) {

					$y = $ce["y"];
					$m = $ce["m"];
					$d = $ce["d"];
					$h = 0;
					$c = $ce["c"];

					$a = strptime($d . '-' . $m . '-' . $y . " " . $h . ":00", '%d-%m-%Y HH:MM');
					$timestamp = mktime($h, 0, 0, $m, $d, $y);

					//$timestamp = strtotime( $d . '-' . $m . '-' . $y . " " . $h . ":00:00");

					$result1->positive[] = [$timestamp,$c];
		}
		$r1->closeCursor();
	}
	// positive

	//negative
	$q1 = "SELECT  YEAR(created_at) y, MONTH(created_at) m , DAY(created_at) d, count(*) c FROM contents c WHERE c." . $researchidcondition . " AND c." . $timecondition . " AND c.comfort <" . (-$negative_threshold) . " GROUP BY YEAR(created_at) , MONTH(created_at), DAY(created_at)  ORDER BY created_at ASC";
	$r1 = $pdo->query( $q1 );
	if($r1){
		foreach ($r1 as $ce) {

					$y = $ce["y"];
					$m = $ce["m"];
					$d = $ce["d"];
					$h = 0;
					$c = $ce["c"];

					$a = strptime($d . '-' . $m . '-' . $y . " " . $h . ":00", '%d-%m-%Y HH:MM');
					$timestamp = mktime($h, 0, 0, $m, $d, $y);

					//$timestamp = strtotime( $d . '-' . $m . '-' . $y . " " . $h . ":00:00");

					
					$result1->negative[] = [$timestamp,$c];
		}
		$r1->closeCursor();
	}
	// negative



	//neutral
	$q1 = "SELECT  YEAR(created_at) y, MONTH(created_at) m , DAY(created_at) d, count(*) c FROM contents c WHERE c." . $researchidcondition . " AND c." . $timecondition . " AND c.comfort >=" . (-$negative_threshold) . " AND c.comfort <=" . ($negative_threshold) . " GROUP BY YEAR(created_at) , MONTH(created_at), DAY(created_at)  ORDER BY created_at ASC";
	$r1 = $pdo->query( $q1 );
	if($r1){
		foreach ($r1 as $ce) {

					$y = $ce["y"];
					$m = $ce["m"];
					$d = $ce["d"];
					$h = 0;
					$c = $ce["c"];

					$a = strptime($d . '-' . $m . '-' . $y . " " . $h . ":00", '%d-%m-%Y HH:MM');
					$timestamp = mktime($h, 0, 0, $m, $d, $y);

					//$timestamp = strtotime( $d . '-' . $m . '-' . $y . " " . $h . ":00:00");

					$result1->neutral[] = [$timestamp,$c];
		}
		$r1->closeCursor();
	}
	// neutral

	if(file_exists($fname)){
		unlink($fname);
	}
	$fp = fopen($fname, 'w');
	fwrite($fp, json_encode($result1));
	fclose($fp);
	// Sentiment timeline
	// -------------------------------------------------------
	// -------------------------------------------------------






	// -------------------------------------------------------
	// -------------------------------------------------------
	// Emotions GeoPoints
	$fname = $fileprefix . "emotions_geoPoints.json";
	$result1 = new \stdClass();
	$result1->data = array();

	$q1 = "SELECT  et.id as emotion_id, et.label as label, lat,lng,count(*) as c FROM contents c , emotions e, emotion_types et WHERE c." . $researchidcondition . " AND e.content_id=c.id AND e.emotion_type_id=et.id AND c." . $timecondition . " GROUP BY lat,lng ";
	$r1 = $pdo->query( $q1 );
	if($r1){
		foreach ($r1 as $c) {
					if( ($c["lat"]!=0 || $c["lng"]!=0) && ($c["lat"]!=-999 || $c["lng"]!=-999)  ){

						$o = new \stdClass();
						$o->c = floatval($c["c"]);
						$o->lat = floatval($c["lat"]);
						$o->lng = floatval($c["lng"]);
						$o->emotion_type_id = $c["emotion_id"];
						$o->label = $c["label"];

						$result1->data[] = $o;	
						
					}
		}
		$r1->closeCursor();
	}
	if(file_exists($fname)){
		unlink($fname);
	}
	$fp = fopen($fname, 'w');
	fwrite($fp, json_encode($result1));
	fclose($fp);
	// Emotions GeoPoints
	// -------------------------------------------------------
	// -------------------------------------------------------







	// -------------------------------------------------------
	// -------------------------------------------------------
	// Emotions
	$fname = $fileprefix . "emotions.json";
	$result1 = new \stdClass();
	$result1->data = array();

	$et = array();

	$q1 = "SELECT * FROM emotion_types";
	$r1 = $pdo->query( $q1 );
	if($r1){
		foreach ($r1 as $e) {
				$o = new \stdClass();
				$o->label = $e["label"];
				$o->id = $e["id"];
				$o->energy = $e["energy"];
				$o->comfort = $e["comfort"];
				$et[] = $o;
		}
		$r1->closeCursor();
	}

	$q1 = "SELECT  count(emotion_type_id) as value, emotion_type_id as emotion_id FROM contents c, emotions e WHERE c." . $researchidcondition . " AND e.content_id=c.id AND c." . $timecondition . " GROUP BY emotion_id ";
	$r1 = $pdo->query( $q1 );
	if($r1){
		foreach ($r1 as $c) {
				$found = false;
				for($i=0; $i<count($et) && !$found;$i++){
					if($et[$i]->id==$c["emotion_id"]){
						$found = true;
						$o = new \stdClass();
						$o->label = $et[$i]->label;
						$o->value = $c["value"];
						$result1->data[] = $o;
					}
				}
		}
		$r1->closeCursor();
	}
	if(file_exists($fname)){
		unlink($fname);
	}
	$fp = fopen($fname, 'w');
	fwrite($fp, json_encode($result1));
	fclose($fp);
	// Emotions
	// -------------------------------------------------------
	// -------------------------------------------------------







	// -------------------------------------------------------
	// -------------------------------------------------------
	// Energy Comfort Distribution
	$fname = $fileprefix . "energy_comfort_distribution.json";
	$result1 = new \stdClass();
	$result1->data = array();


	$q1 = "SELECT comfort, energy, count(*) as c  FROM contents c WHERE c." . $researchidcondition . " AND c." . $timecondition . " GROUP BY comfort,energy ";
	$r1 = $pdo->query( $q1 );
	if($r1){
		foreach ($r1 as $c) {
				if($c["comfort"]!=0 || $c["energy"]!=0){

					$o = new \stdClass();
					$o->c = $c["c"];
					$o->comfort = $c["comfort"];
					$o->energy = $c["energy"];

					$result1->data[] = $o;	

				}
		}
		$r1->closeCursor();
	}
	if(file_exists($fname)){
		unlink($fname);
	}
	$fp = fopen($fname, 'w');
	fwrite($fp, json_encode($result1));
	fclose($fp);
	// Energy Comfort Distribution
	// -------------------------------------------------------
	// -------------------------------------------------------




	// -------------------------------------------------------
	// -------------------------------------------------------
	// Emotions Timelines
	$fname = $fileprefix . "emotions_timelines.json";
	$result1 = array();
	
	$emotionsnames = ["Surprise","Interest","Arousal","Amusement","Proudness","Confidence","Satisfaction","Happiness","Pleasure","Content","Comfort","Sympathy","Tranquillity","Relax","Calm","Lethargy","Boredom","Depression","Sadness","Guilt","Miserability","Displeasure","Disgust","Anger","Fear","Embarassment","Contempt","Confusion","Affliction","Restlessness","Disturbance","Agitation","Terror","Nervous","Tension","Pain"];

	$emvalues = array();

	foreach ($emotionsnames as $e) {
		$result1[$e] = array();


		$emotionID = -1;

			$qq = "SELECT id FROM emotion_types WHERE label='" . $e . "'";

			if($qq!=""){
				$re1 = $pdo->query( $qq );
				if($re1 && $row = $re1->fetch()){
					$emotionID = $row["id"];
					$r1->closeCursor();
				}
			}	

		if($emotionID!=-1){
			$q1 = "SELECT YEAR(created_at) y, MONTH(created_at) m , DAY(created_at) d, count(*) c FROM contents c , emotions e WHERE c." . $researchidcondition . " AND c.id=e.content_id AND c." . $timecondition . " AND e.emotion_type_id=" . $emotionID . " GROUP BY YEAR(created_at) , MONTH(created_at), DAY(created_at) ORDER BY created_at ASC";
			$r1 = $pdo->query( $q1 );
			if($r1){
				foreach ($r1 as $ce) {
						$y = $ce["y"];
						$m = $ce["m"];
						$d = $ce["d"];
						$h = 0;
						$c = $ce["c"];

						$a = strptime($d . '-' . $m . '-' . $y . " " . $h . ":00", '%d-%m-%Y HH:MM');
						$timestamp = mktime($h, 0, 0, $m, $d, $y);

						$result1[$e][] = [$timestamp,$c];

						$foundv = false;
						for($kk = 0 ; $kk<count($emvalues)&&!$foundv; $kk++){
							if($emvalues[$kk]->emotion==$e){
								$emvalues[$kk]->value=$emvalues[$kk]->value+$c;
								$foundv = true;
							}	
						}
						if(!$foundv){
							$ooo = new \stdClass();
							$ooo->emotion = $e;
							$ooo->value = $c;
							$emvalues[] = $ooo;
						}
						

				}
				$r1->closeCursor();
			}	
		}
		

	}
	if(file_exists($fname)){
		unlink($fname);
	}
	$fp = fopen($fname, 'w');
	fwrite($fp, json_encode($result1));
	fclose($fp);
	// Emotions Timelines
	// -------------------------------------------------------
	// -------------------------------------------------------





	// -------------------------------------------------------
	// -------------------------------------------------------
	// max emotions and posts
	$fname = $fileprefix . "max_emotions.json";
	$result1 = array();
	

	// sort $emvalues
	function cmpemvalues($a, $b)
	{
	    return $b->value - $a->value;
	}
	usort($emvalues,"cmpemvalues");

	for ($kkk=0; $kkk<count($emvalues)&&$kkk<5; $kkk++) {

		$e = $emvalues[$kkk];
		$result1[$e->emotion] = array();


		$emotionID = -1;

			$qq = "SELECT id FROM emotion_types WHERE label='" . $e->emotion . "'";

			if($qq!=""){
				$re1 = $pdo->query( $qq );
				if($re1 && $row = $re1->fetch()){
					$emotionID = $row["id"];
					$r1->closeCursor();
				}
			}	

		if($emotionID!=-1){
			$q1 = "SELECT c.content as content , c.created_at as created_at FROM contents c , emotions e WHERE c." . $researchidcondition . " AND c.id=e.content_id AND c." . $timecondition . " AND e.emotion_type_id=" . $emotionID . " ORDER BY retweet_count DESC, favorite_count DESC LIMIT 0,1";
			$r1 = $pdo->query( $q1 );
			if($r1){
				foreach ($r1 as $ce) {
						
						$emmax = new \stdClass();
						$emmax->emotion = $e->emotion;
						$emmax->value = $e->value;
						$emmax->content = $ce["content"];
						$emmax->created_at = $ce["created_at"];

						$result1[$e->emotion][] = $emmax;

				}
				$r1->closeCursor();
			}	
		}
		

	}
	if(file_exists($fname)){
		unlink($fname);
	}
	$fp = fopen($fname, 'w');
	fwrite($fp, json_encode($result1));
	fclose($fp);
	// max emotions and posts
	// -------------------------------------------------------
	// -------------------------------------------------------




	// -------------------------------------------------------
	// -------------------------------------------------------
	// Top Users
	$fname = $fileprefix . "top_users.json";
	$result1 = new \stdClass();
	$result1->reach = array();
	$result1->ratio = array();
	

	// by reach
	$q1 = "SELECT  s.id as id, s.screen_name as nick, s.name as name, s.followers_count*count(*) as reach FROM contents c , subjects s WHERE c." . $researchidcondition . " AND c.subject_id=s.id AND c." . $timecondition . "  GROUP BY c.subject_id ORDER BY reach DESC LIMIT 0,10";
	$r1 = $pdo->query( $q1 );
	if($r1){
		foreach ($r1 as $ce) {
				$o = new \stdClass();
				$o->id = $ce["id"];
				$o->nick = $ce["nick"];
				$o->name = $ce["name"];
				$o->reach = $ce["reach"];
				$result1->reach[] = $o;
		}
		$r1->closeCursor();
	}	


	// by ratio
	$q1 = "SELECT id,nick,name, (favorites+shares)/posts as ratio FROM (SELECT  s.id as id, s.screen_name as nick, s.name as name, sum(favorite_count) as favorites, sum(retweet_count) as shares, count(*) as posts FROM contents c , subjects s WHERE c." . $researchidcondition . " AND c.subject_id=s.id AND c." . $timecondition . "  GROUP BY c.subject_id) a ORDER BY ratio DESC LIMIT 0,10";

	$r1 = $pdo->query( $q1 );
	if($r1){
		foreach ($r1 as $ce) {
				$o = new \stdClass();
				$o->id = $ce["id"];
				$o->nick = $ce["nick"];
				$o->name = $ce["name"];
				$o->ratio = $ce["ratio"];
				$result1->ratio[] = $o;
		}
		$r1->closeCursor();
	}	
		

	if(file_exists($fname)){
		unlink($fname);
	}
	$fp = fopen($fname, 'w');
	fwrite($fp, json_encode($result1));
	fclose($fp);
	// Top Users
	// -------------------------------------------------------
	// -------------------------------------------------------




	// -------------------------------------------------------
	// -------------------------------------------------------
	// Topics
	$fname = $fileprefix . "topics.json";
	$result1 = new \stdClass();
	$result1->topics = array();
	$result1->hitparade = array();
	$result1->stats = new \stdClass();
	$result1->stats->ntopics = 0;
	$result1->stats->toptopic = "";
	$result1->stats->toptopicn = 0;
	

	$q1 = "SELECT  e.entity as entity FROM contents c , contents_entities ce , entities e WHERE c." . $researchidcondition . " AND ce.content_id=c.id AND e.id=ce.entity_id AND e.entity_type_id=1 AND c." . $timecondition . " ";
	$r1 = $pdo->query( $q1 );
	if($r1){
		foreach ($r1 as $v) {
				$label = $v["entity"];
				if(isset($result1->topics[$label])){
					$result1->topics[$label] = $result1->topics[$label] +1;
				} else {
					$result1->topics[$label] = 1;
				}
				if($result1->stats->toptopicn<$result1->topics[$label]){
					$result1->stats->toptopicn = $result1->topics[$label];
					$result1->stats->toptopic = $label;
				}
		}
		$r1->closeCursor();
	}

	$result1->stats->ntopics = count($result1->topics);

	$tmptop = array();

	foreach ($result1->topics as $key => $value) {
		$o = new \stdClass();
		$o->topic = $key;
		$o->n = intval($value);
		$tmptop[] = $o;
	}

	function comptopics($a,$b){
		return $b->n - $a->n;
	}
	usort($tmptop, "comptopics");

	for($idx= 0; $idx<count($tmptop) && $idx<20; $idx++){
		$o = $tmptop[$idx];
		$o->content = "";

		$q2 = "SELECT content, shares, favorite, (shares+favorite) as engage FROM ( SELECT c.content as content, c.retweet_count as shares, c.favorite_count as favorite FROM entities e, contents_entities ec, contents c WHERE e.entity='" .  str_replace("'", "\'", $o->topic ) . "'  AND  ec.entity_id=e.id AND c.id=ec.content_id AND c." . $researchidcondition . "  AND c." . $timecondition . " ) a ORDER BY engage DESC LIMIT 0,1";
		$r2 = $pdo->query( $q2 );
		if($r2){
			foreach ($r2 as $rowre) {
				$o->content = $rowre["content"];
			}
			$r2->closeCursor();
		}
		$result1->hitparade[] = $o;
	}
	
	if(file_exists($fname)){
		unlink($fname);
	}
	$fp = fopen($fname, 'w');
	fwrite($fp, json_encode($result1));
	fclose($fp);
	// Topics
	// -------------------------------------------------------
	// -------------------------------------------------------




	// -------------------------------------------------------
	// -------------------------------------------------------
	// GEO Points and Polys
	$fname = $fileprefix . "geo_points_and_polys.json";
	$result1 = new \stdClass();
	$result1->points = array();
	$result1->polys = array();	

	
	//polys
	for($i = 0; $i<count($GeoPolygonFiles); $i++){
		$data = json_decode( file_get_contents( dirname( dirname(__FILE__) ) . $GeoPolygonFiles[$i]) );

		$o = new \stdClass();
		$o->color = "rgba(255,255,255,0.5)";
		if(isset($data->color)){
			$o->color = $data->color;
			$o->category = $GeoPolygonsName;
			$o->file = $GeoPolygonFiles[$i];
			$o->features = array();
			if(isset($data->features) && is_array($data->features)){
				foreach ($data->features as $feat) {
					$oo = new \stdClass();
					$oo->Name = $feat->properties->Name;
					$oo->search = $feat->properties->search;
					$oo->keywords = explode(",", $oo->search);
					$oo->geometry = $feat->geometry;
					$oo->results = array();

					$q1 = "SELECT count(*) as c, AVG(comfort) as comfort, AVG(energy) as energy FROM contents c WHERE c." . $researchidcondition . " AND c." . $timecondition . " AND ( 1=0 ";

					for($j=0; $j<count($oo->keywords); $j++){
						$q1 = $q1 . ' OR UCASE(c.content) LIKE "%' . trim( strtoupper( $oo->keywords[$j]) ) . '%" ';
					}

					$q1 = $q1 . ' ) ';

					$r1 = $pdo->query( $q1 );
					if($r1){
						foreach ($r1 as $ce) {
							$oo->results[] = $ce;
						}

						$r1->closeCursor();
					}
					$o->features[] = $oo;
				}
			}
		}

		$result1->polys[] = $o;

	}
	//polys



	//points
	for($i = 0; $i<count($GeoPointFiles); $i++){
		$data = json_decode( file_get_contents( dirname( dirname(__FILE__) ) . $GeoPointFiles[$i]) );
		//print_r($data);

		$o = new \stdClass();
		$o->color = "rgba(255,255,255,0.5)";
		if(isset($data->color)){
			$o->color = $data->color;
			$o->category = $GeoPointsName;
			$o->file = $GeoPointFiles[$i];
			$o->features = array();
			if(isset($data->features) && is_array($data->features)){
				foreach ($data->features as $feat) {
					$oo = new \stdClass();
					$oo->Name = $feat->properties->Name;
					$oo->search = $feat->properties->search;
					$oo->keywords = explode(",", $oo->search);
					$oo->results = array();
					$oo->geometry = $feat->geometry;

					$q1 = "SELECT count(*) as c, AVG(comfort) as comfort, AVG(energy) as energy FROM contents c WHERE c." . $researchidcondition . " AND c." . $timecondition . " AND ( 1=0 ";

					for($j=0; $j<count($oo->keywords); $j++){
						$q1 = $q1 . ' OR UCASE(c.content) LIKE "%' . trim( strtoupper( $oo->keywords[$j]) ) . '%" ';
					}

					$q1 = $q1 . ' ) ';

					$r1 = $pdo->query( $q1 );
					if($r1){
						foreach ($r1 as $ce) {
							$oo->results[] = $ce;
						}

						$r1->closeCursor();
					}
					$o->features[] = $oo;
				}
			}
		}

		$result1->points[] = $o;

	}
	//points



	if(file_exists($fname)){
		unlink($fname);
	}
	$fp = fopen($fname, 'w');
	fwrite($fp, json_encode($result1));
	fclose($fp);
	// GEO Points and Polys
	// -------------------------------------------------------
	// -------------------------------------------------------





	// -------------------------------------------------------
	// -------------------------------------------------------
	// Clusters
	$fname = $fileprefix . "clusters.json";
	$result1 = new \stdClass();
	$result1->clusters = array();

	$clusters = json_decode( file_get_contents( dirname( dirname(__FILE__) ) . "/data/clusters.json") );
	//print_r($clusters);

	for($ko = 0; $ko<count($clusters); $ko++){
		$clusters[$ko]->data = array();


			$q1 = 'SELECT DISTINCT r.subject_1_id as s1id, r.subject_2_id as s2id ' ;


			for($i = 0; $i<count($clusters[$ko]->categories); $i++){

				$clusters[$ko]->categories[$i]->timeline = array();


				// gen timeline
				$q3 = "SELECT YEAR(created_at) y, MONTH(created_at) m , DAY(created_at) d, count(*) c FROM contents c WHERE c." . $researchidcondition . " AND c." . $timecondition . " AND (1=0 ";
				
				// insert search condition

				$cond = explode(",",  $clusters[$ko]->categories[$i]->search );
				for ($j = 0 ; $j<count($cond); $j++){
					$q3 = $q3 . " OR UCASE(content) LIKE '" . str_replace("'", "\'", strtoupper($cond[$j]) ) . "' ";
				}


				$q3 = $q3 . " ) GROUP BY YEAR(created_at) , MONTH(created_at), DAY(created_at) ORDER BY created_at ASC";
					$r3 = $pdo->query( $q3 );
					if($r3){
						foreach ($r3 as $ce) {
								$y = $ce["y"];
								$m = $ce["m"];
								$d = $ce["d"];
								$h = 0;
								$c = $ce["c"];

								$a = strptime($d . '-' . $m . '-' . $y . " " . $h . ":00", '%d-%m-%Y HH:MM');
								$timestamp = mktime($h, 0, 0, $m, $d, $y);

								$clusters[$ko]->categories[$i]->timeline[] = [$timestamp,$c];

								$foundv = false;
								for($kk = 0 ; $kk<count($emvalues)&&!$foundv; $kk++){
									if($emvalues[$kk]->emotion==$e){
										$emvalues[$kk]->value=$emvalues[$kk]->value+$c;
										$foundv = true;
									}	
								}
								if(!$foundv){
									$ooo = new \stdClass();
									$ooo->emotion = $e;
									$ooo->value = $c;
									$emvalues[] = $ooo;
								}
								

						}
						$r1->closeCursor();
					}
				// gen timeline

				$q1 = $q1 . " , CASE WHEN ( ";

				$cond = explode(",",  $clusters[$ko]->categories[$i]->search );
				for ($j = 0 ; $j<count($cond); $j++){
					$q1 = $q1 . " UCASE(content) LIKE '" . str_replace("'", "\'", strtoupper($cond[$j]) ) . "' OR ";
				}

				$q1 = $q1 . " 1=0 ) THEN 1 ELSE 0 END as  " . $clusters[$ko]->categories[$i]->slug  . " ";

			}

			$q1 = $q1 . ' FROM contents c, relations r WHERE c.' .  $researchidcondition .  ' AND (c.subject_id=r.subject_1_id OR c.subject_id=r.subject_2_id) AND ' . $timecondition . " ";

			$q1 = $q1 . " AND ( ";

			for($i = 0; $i<count($clusters[$ko]->categories); $i++){

				$cond = explode(",",  $clusters[$ko]->categories[$i]->search );
				for ($j = 0 ; $j<count($cond); $j++){
					$q1 = $q1 . " UCASE(content) LIKE '" . str_replace("'", "\'", strtoupper($cond[$j]) ) . "' OR ";
				}

			}

			$q1 = $q1 . " 1=0 ) ";

			$r1 = $pdo->query( $q1 );
			if($r1){

				foreach ($r1 as $row) {
					$clusters[$ko]->data[] = $row;
				}
				$r1->closeCursor();
			}


	}

	$result1->clusters = $clusters;

	if(file_exists($fname)){
		unlink($fname);
	}
	$fp = fopen($fname, 'w');
	fwrite($fp, json_encode($result1));
	fclose($fp);
	// Clusters
	// -------------------------------------------------------
	// -------------------------------------------------------






	// -------------------------------------------------------
	// -------------------------------------------------------
	// Copy html files to report directory

	$destfile = $dirname . "/index.html";
	$sourcefile = dirname( dirname(__FILE__) ) . "/templates/index.html";

	if(file_exists($destfile)){
		unlink($destfile);
	}
	copy($sourcefile, $destfile);


	// Copy html files to report directory
	// -------------------------------------------------------
	// -------------------------------------------------------





 
} else {

	echo("usage: getDataForCurrentMonth.php  [comma separated list of researches IDs]\n");

}



?>