function ai(){
}


ai.prototype.aiagent = function(game_data)
{
return calaction(game_data);
}


function calaction(game_data)
{
	var val = 0;
	var action = 0;
	for (var i=0; i<4; i++)
	{
		game = new AIGameManager(game_data);
		game.move(i);
		
		var score = exp_value(game.serialize(), 3);
		if (score > val)
		{
			val = score;
			action = i;
		}
	}
	return action;
}



function agent_succ(game_data){
	var successors = [];
	for (var i=0;i<4;i++)
	{
		game = new AIGameManager(game_data);
		game.move(i);
		successors.push(game.serialize());
	}
	return successors;
}

function environ_succ(game_data){
	var successors = [];
	var probability = [];
	var grid = new Grid(game_data.grid.size,
                                game_data.grid.cells);
	var allcells = grid.availableCells();
	var numallcells = allcells.length;
	alert(numallcells);
	for (var i=0; i < numallcells ; i++)
	{
		game = new AIGameManager(game_data);
		game.addTile(allcells[i], 2);
		successors.push(game.serialize());
		probability.push(1/numallcells*0.9);
		game = new AIGameManager(game_data);
		game.addTile(allcells[i], 4);
		successors.push(game.serialize());
		probability.push(1/numallcells*0.1);

	}
	alert("successors"+successors);
	return [successors,probability];
}


function max_value(game_data, d)
{
	var v = -1000000;
	var successors = agent_succ(game_data);
	for (var i=0; i < successors.length; i++)
	{
		v = Math.max(v, value(successors[i], d, 0));
	}
	return v;
}

function exp_value(game_data , d)
{
	var v = 0;
	var data = environ_succ(game_data);
	var successors = data[0];
	var probability = data[1];
	for (var i=0; i < successors.length; i++)
	{
		p = probability[i];
		v += p*value(successors[i], d , 1);
	}
	return v;
}

function value(state , d, a)
{
	if (d == 0)
	{
		return state.score;
	}
	if (a == 0)
	{
		return exp_value(state, d-1);
	} 
	else
	{
		return max_value(state, d-1);
	}
}