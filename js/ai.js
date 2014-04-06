function ai(){
}


ai.prototype.aiagent = function(game_data)
{
return calaction(game_data);
}


function calaction(game_data)
{
	var val = 0;
	var action = Math.floor((Math.random()*4));
	var presentScore = game_data.score;
	//alert("presentScore" + presentScore)
	for (var i=0; i<4; i++)
	{
		game = new AIGameManager(game_data);
		game.move(i);
		allcells = game.grid.availableCells();
		// if (game.score < 5000)
		// { 
		if(game.validmove)
		{
			if (game.score < 3000 || allcells.length > 5 && !allcells.length < 5)
			{ 
			var score = exp_value(game.serialize(), 3 , presentScore );
			//var score = evaluate(game.serialize() , presentScore)
			
			}
			else if(game.score < 7000)
			{ 
			var score = exp_value(game.serialize(), 4 , presentScore);
			}
			else
			{
			var score = exp_value(game.serialize(), 5 , presentScore);	
			}
			//alert("score "+ i +" "+score);
			if (score > val)
			{
				val = score;
				action = i;
			}
		}
	}
	//alert("action " + action);
	return action;
};



function agent_succ(game_data){
	var successors = [];
	for (var i=0;i<4;i++)
	{
		game = new AIGameManager(game_data);
		game.move(i);
		successors.push(game.serialize());
	}
	return successors;
};

function environ_succ(game_data){
	var successors = [];
	var probability = [];
	var grid = new Grid(game_data.grid.size,
                                game_data.grid.cells);
	var allcells = grid.availableCells();
	var numallcells = allcells.length;
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
	return [successors,probability];
};


function max_value(game_data, d , presentScore)
{
	var v = -1000000;
	var successors = agent_succ(game_data);
	for (var i=0; i < successors.length; i++)
	{
		v = Math.max(v, value(successors[i], d, 0 , presentScore));
	}
	return v;
};

function exp_value(game_data , d , presentScore)
{
	var v = 0;
	var data = environ_succ(game_data);
	var successors = data[0];
	var probability = data[1];
	for (var i=0; i < successors.length; i++)
	{
		p = probability[i];
		v += p*value(successors[i], d , 1 , presentScore);
	}
	return v;
};

function value(state , d, a, presentScore)
{
	if (d == 0 || state.won || state.over)
	{
		return evaluate(state, presentScore);
	}
	if (a == 0)
	{
		return exp_value(state, d-1, presentScore);
	} 
	else
	{
		return max_value(state, d-1, presentScore);
	}
};

function evaluate(state , presentScore)
{
	var diff = state.score - presentScore;
	var bonus = 0;
	if (state.won)
	{
		bonus = 50000;
	}
	if (state.over)
	{
		return -10000000;
	}
	var reppoints = representation(state);
	return diff * 200 + reppoints ;//+ bonus;// + reppoints + bonus;
};

function representation(state)
{
	var reppoints = 0;
	var grid = new Grid(state.grid.size,state.grid.cells);
	var cellsoccupied = [];
	var cellscontent = [];
	var cellsordered = [];
	var ans = [];
	grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
		  cellsoccupied.push([cell.y,cell.x]);
		  cellsordered.push(cell.value);
		  cellscontent.push(cell.value);
   		}
	
	});
    });
	cellscontent.sort(function(a,b){return a-b});
	
	var maxx1 = cellscontent.pop();
	var maxx2 = cellscontent.pop();

	var index1 = cellsordered.indexOf(maxx1);
	var pos = cellsoccupied[index1];
	ans.push(pos[0]);
	ans.push(pos[1]);
	if ((ans[0] == 0 && ans[1] == 0)||(ans[0] == 0 && ans[1] == 3)||(ans[0] == 3 && ans[1] == 0)||(ans[0] == 3 && ans[1] == 3))
	{
		reppoints = 20000000;
	}
	if ((ans[0] == 1 && ans[1] == 1)||(ans[0] == 1 && ans[1] == 2)||(ans[0] == 2 && ans[1] == 1)||(ans[0] == 2 && ans[1] == 2))
	{
		reppoints = -1000000;
	}
	if ((ans[0] == 1 && ans[1] == 0)||(ans[0] == 2 && ans[1] == 0)||(ans[0] == 0 && ans[1] == 1)||(ans[0] == 0 && ans[1] == 2))
	{
		reppoints = -700000;
	}
	if ((ans[0] == 3 && ans[1] == 1)||(ans[0] == 3 && ans[1] == 2)||(ans[0] == 1 && ans[1] == 3)||(ans[0] == 2 && ans[1] == 3))
	{
		reppoints = -700000;
	}
	

	var index2 = cellsordered.indexOf(maxx2);
	var pos = cellsoccupied[index2];
	var penalty = Math.abs(ans[0]-pos[0])+Math.abs(ans[1]-pos[1]);

	ans.push(pos[0]);
	ans.push(pos[1]);
	if ((ans[0] == 1 && ans[1] == 1)||(ans[0] == 1 && ans[1] == 2)||(ans[0] == 2 && ans[1] == 1)||(ans[0] == 2 && ans[1] == 2))
	{
		reppoints += -200000;
	}
	// if ((ans[0] == 1 && ans[1] == 0)||(ans[0] == 2 && ans[1] == 0)||(ans[0] == 0 && ans[1] == 1)||(ans[0] == 0 && ans[1] == 2))
	// {
	// 	reppoints += +100000;
	// }
	// if ((ans[0] == 3 && ans[1] == 1)||(ans[0] == 3 && ans[1] == 2)||(ans[0] == 1 && ans[1] == 3)||(ans[0] == 2 && ans[1] == 3))
	// {
	// 	reppoints += +100000;
	// }
	
	var maxx3 = cellscontent.pop();

	var index3 = cellsordered.indexOf(maxx3);
	var pos = cellsoccupied[index3];
	var penalty2 = Math.abs(ans[0]-pos[0])+Math.abs(ans[1]-pos[1]);
	ans.push(pos[0]);
	ans.push(pos[1]);
	// if ((ans[0] == 1 && ans[1] == 1)||(ans[0] == 1 && ans[1] == 2)||(ans[0] == 2 && ans[1] == 1)||(ans[0] == 2 && ans[1] == 2))
	// {
	// 	reppoints += -200000;
	// }
	// if ((ans[0] == 1 && ans[1] == 0)||(ans[0] == 2 && ans[1] == 0)||(ans[0] == 0 && ans[1] == 1)||(ans[0] == 0 && ans[1] == 2))
	// {
	// 	reppoints += -100000;
	// }
	// if ((ans[0] == 3 && ans[1] == 1)||(ans[0] == 3 && ans[1] == 2)||(ans[0] == 1 && ans[1] == 3)||(ans[0] == 2 && ans[1] == 3))
	// {
	// 	reppoints += -100000;
	// }

	var maxx4 = cellscontent.pop();

	var index4 = cellsordered.indexOf(maxx4);
	var pos = cellsoccupied[index4];
	var penalty3 = Math.abs(ans[0]-pos[0])+Math.abs(ans[1]-pos[1]);
	ans.push(pos[0]);
	ans.push(pos[1]);
	// if ((ans[0] == 0 && ans[1] == 0)||(ans[0] == 0 && ans[1] == 3)||(ans[0] == 3 && ans[1] == 0)||(ans[0] == 3 && ans[1] == 3))
	// {
	// 	reppoints += 5000;
	// }




	return reppoints + (16 - cellsoccupied.length) * 20000 - Math.pow(penalty,2) * maxx2 *500 - Math.pow(penalty2,2) * maxx3 * 300 - Math.pow(penalty3,2) * maxx4 * 300;
};