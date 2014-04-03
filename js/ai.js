function ai(){
}

ai.prototype.naiveagent = function(game_data){
	var maxx = 0;
	var action = 0;
	for (var i=0;i<4;i++)
	{
		var score = agent_succ(game_data, i);
		if (score > maxx)
		{
			maxx = score;
			action = i;
		}
	}
return action;
}

function agent_succ(game_data, x){
	game = new AIGameManager(game_data);
	game.move(x);
	return game.score;
}

