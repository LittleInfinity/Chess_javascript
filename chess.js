//global variables.

var board = [64];
var side_to_move = 'w';
var castling = null;
var enpass = null;
var halfmove = null;
var fullmoves = null;
var enpass;

var possible_moves = [];

var  columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
var rows = ['1', '2', '3', '4', '5', '6', '7', '8'];
var white_pieces = ["♙","♖","♘","♗","♕", "♔" ];
var black_pieces = ["♟", "♝", "♞", "♜", "♛", "♚"];
var black_pieces_char = ['p', 'r', 'n', 'q', 'b'];
var white_pieces_char = ['P', 'R', 'N', 'Q', 'B'];

var prev_highlighted_sq = null;
var prev_highlighted_sq_color = null;

var grabbed_piece = false;
var grabbed_piece_id = null;
var grabbed_square = null;

var board_with_notations = [	"a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8",
				"a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
				"a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
				"a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
				"a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
				"a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
				"a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
				"a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"
]
			    
var piece_vals = {
			'p': "&#9823",
			'r': "&#9820",
			'n': "&#9822",
			'b': "&#9821",
			'k': "&#9818",
			'q': "&#9819",

			'P':"&#9817",
			'R': "&#9814",
			'N': "&#9816",
			'B': "&#9815",
			'K': "&#9812",
			'Q': "&#9813"
};

//this function generates pawn moves.
function gen_pawn_moves(color)
{
	var pawn_moves = [];
	if(color == 'w')
	{
		for(var i = 0; i<63; i++)
		{
			if(board[i] == 'P')
			{
				if(i>=0 && i<=63 && board[i-8] == null) //forware move
					pawn_moves.push([i,i-8]);
				if(i>=0 && i<=63 && (board[i-8] == null) && (board[i-16] == null) && [48, 49, 50, 51, 52, 53, 54, 55].includes(i)) //two steps are allowed as first move of pawns.
					pawn_moves.push([i,i-16]);
				if(i>=0 && i<=63 && ((black_pieces_char.includes(board[i-7])) || (i-7) == board_with_notations.indexOf(enpass)))//diagonally right capture move.
					pawn_moves.push([i,i-7]);
				if(i>=0 && i<=63 &&  (black_pieces_char.includes(board[i-9])|| ((i-9) == board_with_notations.indexOf(enpass))) )//diagonally left capture move.
					pawn_moves.push([i,i-9]);
			}
		}
	}

	if(color == 'b')
	{
		for(var i = 0; i<63; i++)
		{
			if(board[i] == 'p')
			{
				if(i>=0 && i<=63 && board[i+8] == null)
					pawn_moves.push([i,i+8]);
				if(i>=0 && i<=63 && (board[i+8] == null) && (board[i+16] == null) && [8, 9, 10, 11, 12, 13, 14, 15].includes(i))
					pawn_moves.push([i,i+16]);
				if(i>=0 && i<=63 && ((white_pieces_char.includes(board[i+7]))||((i+7) == board_with_notations.indexOf(enpass))))
					pawn_moves.push([i,i+7]);
				if(i>=0 && i<=63 && ((white_pieces_char.includes(board[i+9])) || ((i+9) == board_with_notations.indexOf(enpass))))
					pawn_moves.push([i,i+9]);
			}

		}
	}
	return pawn_moves;
		
}

function gen_king_moves(color)
{
	var king_moves = [];
	var king = null;
	if(color == 'w')
		king = 'K';
	else 
		king = 'k';
	for(var i = 0; i<63; i++)
	{
		if(board[i] == king)
		{
			if(i-8>=0 && i-8<=63 && (board[i-8] == null || piece_color(document.getElementById(board_with_notations[i-8]).innerHTML) != color))
				king_moves.push([i, i-8]);
			if(i-9>=0 && i-9<=63 && (board[i-9] == null || piece_color(document.getElementById(board_with_notations[i-9]).innerHTML) != color))
				king_moves.push([i, i-9]);
			if(i-7>=0 && i-7<=63 && (board[i-7] == null || piece_color(document.getElementById(board_with_notations[i-7]).innerHTML) != color))
				king_moves.push([i, i-7]);
			if(i-1>=0 && i-1<=63 && (board[i-1] == null || piece_color(document.getElementById(board_with_notations[i-1]).innerHTML) != color))
				king_moves.push([i, i-1]);
			if(i+1>=0 && i+1<=63 && (board[i+1] == null || piece_color(document.getElementById(board_with_notations[i+1]).innerHTML) != color))
				king_moves.push([i, i+1]);
			if(i+8>=0 && i+8<=63 && (board[i+8] == null || piece_color(document.getElementById(board_with_notations[i+8]).innerHTML) != color))
				king_moves.push([i, i+8]);
			if(i+9>=0 && i+9<=63 && (board[i+9] == null || piece_color(document.getElementById(board_with_notations[i+9]).innerHTML) != color))
				king_moves.push([i, i+9]);
			if(i+7>=0 && i+7<=63 && (board[i+7] == null|| piece_color(document.getElementById(board_with_notations[i+7]).innerHTML) != color))
				king_moves.push([i, i+7]);
		}
	}
	return king_moves;
}

function gen_queen_moves(color)
{
	var queen_moves = [];
	var queen = null;
	if(color == 'w')
		queen = 'Q';
	else 
		queen = 'q';
	for(var i = 0; i<=63; i++)
	{
		if(board[i] == queen)
		{
			//right side moves
			var j = i+1;
			while(j<= ((Math.floor(i/8)+1)*8-1))
			{
				if(j>=0 && j<=63 && board[j] == null)
					queen_moves.push([i, j]);
				else if(piece_color(document.getElementById(board_with_notations[j]).innerHTML) != color)
				{
					queen_moves.push([i, j]);
					break;
				}
				else
					break;
				j++;
			}
			//left side moves.
			j = i-1;
			while(j >= Math.floor(i/8)*8)
			{
				if(j>=0 && j<=63 && board[j] == null)
					queen_moves.push([i, j]);
				else if(piece_color(document.getElementById(board_with_notations[j]).innerHTML) != color)
				{
					queen_moves.push([i, j]);
					break;
				}
				else
					break;
				j--;
			}

			//up side moves
			j = i - 8;
			while(j>=0 && j<=63)
			{
				if(j>=0 && j<=63 && board[j] == null)
					queen_moves.push([i, j]);

				else if(piece_color(document.getElementById(board_with_notations[j]).innerHTML) != color)
				{
					queen_moves.push([i, j]);
					break;
				}
				else
					break;
				j = j-8;
			}
				
			//down side moves.
			j = i + 8;
			while(j <= 63 && j<=63)
			{
				if(j>=0 && j<=63 && board[j] == null)
					queen_moves.push([i, j]);
				else if(piece_color(document.getElementById(board_with_notations[j]).innerHTML) != color)
				{
					queen_moves.push([i, j]);
					break;
				}
				else
					break;
				j = j+8;
			}


			// north-west moves.
			j = i-9;
			while(j>=0 && ![7, 15, 23, 31, 39, 47, 55, 63].includes(j))
			{
				if(j>=0 && j<=63 && board[j] == null)
					queen_moves.push([i, j]);
				else if(piece_color(document.getElementById(board_with_notations[j]).innerHTML) != color)
				{
					queen_moves.push([i, j]);
					break;
				}
				else
					break;
				j = j-9;
			}
			// north-east moves.
			j = i-7;
			while(j >= 0 && ![0, 8, 16, 24, 32, 40, 48, 56].includes(j))
			{
				if(j>=0 && j<=63 && board[j] == null)
					queen_moves.push([i, j]);
				else if(piece_color(document.getElementById(board_with_notations[j]).innerHTML) != color)
				{
					queen_moves.push([i, j]);
					break;
				}
				else
					break;
				j = j-7;
			}

			//south-west moves.
			j = i + 7;
			while(j<=63 && ![7, 15, 23, 31, 39, 47, 55, 63].includes(j))
			{
				if(j>=0 && j<=63 && board[j] == null)
					queen_moves.push([i, j]);

				else if(piece_color(document.getElementById(board_with_notations[j]).innerHTML) != color)
				{
					queen_moves.push([i, j]);
					break;
				}
				else
					break;
				j = j+7;
			}
				
			// south-east moves.
			j = i + 9;
			while(j <= 63 && ![0, 8, 16, 24, 32, 40, 48, 56].includes(j))
			{
				if(j>=0 && j<=63 && board[j] == null)
					queen_moves.push([i, j]);
				else if(piece_color(document.getElementById(board_with_notations[j]).innerHTML) != color)
				{
					queen_moves.push([i, j]);
					break;
				}
				else
					break;
				j = j+9;
			}

		}
	}
	return queen_moves;
}

function gen_rook_moves(color)
{
	var rook_moves = [];
	var rook = null;
	if(color == 'w')
		rook = 'R';
	else 
		rook = 'r';
	for(var i = 0; i<=63; i++)
	{
		if(board[i] == rook)
		{
			//right side moves
			var j = i+1;
			while(j<= ((Math.floor(i/8)+1)*8-1))
			{
				if(j>=0 && j<=63 && board[j] == null)
					rook_moves.push([i, j]);
				else if(piece_color(document.getElementById(board_with_notations[j]).innerHTML) != color)
				{
					rook_moves.push([i, j]);
					break;
				}
				else
					break;
				j++;
			}
			//left side moves.
			j = i-1;
			while(j >= Math.floor(i/8)*8)
			{
				if(j>=0 && j<=63 && board[j] == null)
					rook_moves.push([i, j]);
				else if(piece_color(document.getElementById(board_with_notations[j]).innerHTML) != color)
				{
					rook_moves.push([i, j]);
					break;
				}
				else
					break;
				j--;
			}

			//up side moves
			j = i - 8;
			while(j>=0 && j<=63)
			{
				if(j>=0 && j<=63 && board[j] == null)
					rook_moves.push([i, j]);

				else if(piece_color(document.getElementById(board_with_notations[j]).innerHTML) != color)
				{
					rook_moves.push([i, j]);
					break;
				}
				else
					break;
				j = j-8;
			}
				
			//down side moves.
			j = i + 8;
			while(j <= 63 && j<=63)
			{
				if(j>=0 && j<=63 && board[j] == null)
					rook_moves.push([i, j]);
				else if(piece_color(document.getElementById(board_with_notations[j]).innerHTML) != color)
				{
					rook_moves.push([i, j]);
					break;
				}
				else
					break;
				j = j+8;
			}
		}
	}
	return rook_moves;
}

function gen_bishop_moves(color)
{
	var bishop_moves = [];
	var bishop = null;
	if(color == 'w')
		bishop = 'B';
	else 
		bishop = 'b';
	for(var i = 0; i<=63; i++)
	{
		if(board[i] == bishop)
		{
			// north-west moves.
			var j = i-9;
			while(j>=0 && ![7, 15, 23, 31, 39, 47, 55, 63].includes(j))
			{
				if(j>=0 && j<=63 && board[j] == null)
					bishop_moves.push([i, j]);
				else if(piece_color(document.getElementById(board_with_notations[j]).innerHTML) != color)
				{
					bishop_moves.push([i, j]);
					break;
				}
				else
					break;
				j = j-9;
			}
			// north-east moves.
			j = i-7;
			while(j >= 0 && ![0, 8, 16, 24, 32, 40, 48, 56].includes(j))
			{
				if(j>=0 && j<=63 && board[j] == null)
					bishop_moves.push([i, j]);
				else if(piece_color(document.getElementById(board_with_notations[j]).innerHTML) != color)
				{
					bishop_moves.push([i, j]);
					break;
				}
				else
					break;
				j = j-7;
			}

			//south-west moves.
			j = i + 7;
			while(j<=63 && ![7, 15, 23, 31, 39, 47, 55, 63].includes(j))
			{
				if(j>=0 && j<=63 && board[j] == null)
					bishop_moves.push([i, j]);

				else if(piece_color(document.getElementById(board_with_notations[j]).innerHTML) != color)
				{
					bishop_moves.push([i, j]);
					break;
				}
				else
					break;
				j = j+7;
			}
				
			// south-east moves.
			j = i + 9;
			while(j <= 63 && ![0, 8, 16, 24, 32, 40, 48, 56].includes(j))
			{
				if(j>=0 && j<=63 && board[j] == null)
					bishop_moves.push([i, j]);
				else if(piece_color(document.getElementById(board_with_notations[j]).innerHTML) != color)
				{
					bishop_moves.push([i, j]);
					break;
				}
				else
					break;
				j = j+9;
			}
		}

	}
	return bishop_moves;
	
}

function gen_knight_moves(color)
{
	var knight_moves = []
	var knight = null;
	if(color == 'w')
		knight = 'N';
	else 
		knight = 'n';
	
	for(var i = 0; i<63; i++)
	{
		if(board[i] == knight)
		{
			if(i-17>=0 && i-17<=63 && (board[i-17] == null || (piece_color(document.getElementById(board_with_notations[i-17]).innerHTML) != color)))
				knight_moves.push([i, i-17]);
			if(i-15>=0 && i-15<=63 && (board[i-15] == null || (piece_color(document.getElementById(board_with_notations[i-15]).innerHTML) != color) ))
				knight_moves.push([i, i-15]);
			if(i-10>=0 && i-10<=63 && (board[i-10] == null || (piece_color(document.getElementById(board_with_notations[i-10]).innerHTML) != color) ))
				knight_moves.push([i, i-10]);
			if(i-6>=0 && i-6<=63 && (board[i-6] == null || (piece_color(document.getElementById(board_with_notations[i-6]).innerHTML) != color) ))
				knight_moves.push([i, i-6]);
			if(i+6>=0 && i+6<=63 && (board[i+6] == null|| (piece_color(document.getElementById(board_with_notations[i+6]).innerHTML) != color) ))
				knight_moves.push([i, i+6]);
			if(i+10>=0 && i+10<=63 && (board[i+10] == null || (piece_color(document.getElementById(board_with_notations[i+10]).innerHTML) != color) ))
				knight_moves.push([i, i+10]);
			if(i+15>=0 && i+15<=63 && (board[i+15] == null || (piece_color(document.getElementById(board_with_notations[i+15]).innerHTML) != color)))
				knight_moves.push([i, i+15]);
			if(i+17>=0 && i+17<=63 && (board[i+17] == null || (piece_color(document.getElementById(board_with_notations[i+17]).innerHTML) != color) ))
				knight_moves.push([i, i+17]);
		}
	}
	return knight_moves;
}

function gen_moves(color)
{
	var all_possible_moves = [];
	all_possible_moves.push.apply(all_possible_moves,  gen_pawn_moves(color));
	all_possible_moves.push.apply(all_possible_moves, gen_knight_moves(color));
	all_possible_moves.push.apply(all_possible_moves, gen_king_moves(color));
	all_possible_moves.push.apply(all_possible_moves, gen_rook_moves(color));
	all_possible_moves.push.apply(all_possible_moves, gen_bishop_moves(color));
	all_possible_moves.push.apply(all_possible_moves, gen_queen_moves(color));
	return all_possible_moves;
}

function gen_castling_moves()
{
	var castle_moves = [];
	if(castling.includes('K'))
	{
		if(board[61] == null && board[62] == null)
		castle_moves.push([60, 62]);
	}
}


function capture_sound_capture()
{
}

function move_sound_normal()
{
	var nomral_sound = new sound("chess_piece_move.wav");
	nomral_sound.play();
}


function piece_color(value)
{
	if(white_pieces.includes(value))
		return 'w';
	else if(black_pieces.includes(value))
		return 'b';
	else 
		return null;
}

//this functions set UI using board[] array and initializes ohter things.
function set_board()
{
	//populate divs from board
	var div_id_second;
	var div_id;
	for (var row = 7; row >= 0; row--)
	{
		div_id_second = rows[row];
		for(var col = 0; col <= 7; col++)
		{
			div_id = columns[col] + div_id_second;
			var ulta = piece_vals[board[(7-row)*8+col]];
			if(board[(7-row)*8+col] != null)
				document.getElementById(div_id).innerHTML =  piece_vals[board[(7-row)*8+col]];
			else
				document.getElementById(div_id).innerHTML = null; 
		}
	}
}

function parse_fen()
{
	var fen = document.getElementById('new_board_pos').value;
	var split_fen = fen.split(" ");
	var pieces = split_fen[0];
	side_to_move = split_fen[1];
	castling = split_fen[2];
	enpass = split_fen[3];
	halfmove = split_fen[4];
	fullmoves = split_fen[5];

	var index = 0;
	var board_index = 0;
	while(fen[index] != ' ')
	{
		if(fen[index] == '\/')
		{
			index++;
			continue;
		}
		if(isNaN(fen[index]))  
		{
				board[board_index++] = fen[index++];
		}
		else
		{
			var num = fen[index] - '0';
			while(num != 0)
			{
				board[board_index++] = null;
				num--;
			}
			index++;
		}
	}
}

function get_fen()
{
	var empty_sq_counter = 0; // to count number of empty squares.
	var fen = "";
	for(var i = 0; i<=63; i++)
	{
		if(i!=0 && i%8==0) // add '/' after end of reach row in board.
			fen += '/';
		if(board[i] == null) //if square is empty.
		{
			empty_sq_counter++;

			if((i+1)%8 == 0 || board[i+1] != null) //if we reach end of row or next square is not empty, then append number of empty squares in fen.
			{
				fen += empty_sq_counter; 
				empty_sq_counter = 0;
			}
			else 
				continue;
		}
		else // if current square is not empty, then append to fen.
			fen += board[i];
	}
	document.getElementById("get_board_pos").value = fen; 
}

function dehighlight_previous_square()
{
	if(prev_highlighted_sq)
	{
		if(document.getElementById(prev_highlighted_sq).className == 'white')
			document.getElementById(prev_highlighted_sq).style.backgroundColor = "#fff";
		else if(document.getElementById(prev_highlighted_sq).className == 'black')
			document.getElementById(prev_highlighted_sq).style.backgroundColor = "#999";
	}
}


function highlight_square(square)
{
	//clear previous selection
	dehighlight_previous_square();

	//highlight current square
	square.style.backgroundColor = "#55AAF3";

	prev_highlighted_sq = square.id;
	prev_highlighted_sq_color = piece_color(square.innerHTML);
}



function get_color(sq)
{
	return piece_color(document.getElementById(sq).innerHTML);
}


function Move(from, to)
{
	this.from = from;
	this.to = to;
}

Move.prototype.is_equal = function(move)
{
	return (this.from = move.from && this.to == move.to);
}

function is_move_valid(all_moves, move)
{
	for(var i = 0; i<all_moves.length; i++)
	{
		if(all_moves[i][0] == move[0] && all_moves[i][1] == move[1])
			return true;
	}
	//if move is not valid, and we have clicked on anotehr square having 
	grabbed_piece = null;
	get_move_from_UI(document.getElementById(board_with_notations[move[1]]));
	return false;
}


function make_move(move)
{
	var color = get_color(move[0]);
	var all_moves = gen_moves(color);
	var mv = [board_with_notations.indexOf(move[0]), board_with_notations.indexOf(move[1])];
	if(is_move_valid(all_moves, mv))
	{

		//update UI board.
		document.getElementById(move[1]).innerHTML = document.getElementById(move[0]).innerHTML;
		document.getElementById(move[0]).innerHTML = null;

		//if enpassant move is made, then we need to remove captured pawn from board as well.
		if((board[board_with_notations.indexOf(move[0])] == 'p' ||board[board_with_notations.indexOf(move[0])] == 'P') && move[1] == enpass)
 
		{
			if(color == 'w')
				document.getElementById(board_with_notations[board_with_notations.indexOf(move[1])+8]).innerHTML = null;
			else if(color == 'b')
				document.getElementById(board_with_notations[board_with_notations.indexOf(move[1])-8]).innerHTML = null;
		}


		move_sound_normal();


		//if it is a pawn move with 2 steps, then set enpassant square.
		if((board[mv[0]] == 'p' || board[mv[0]] == 'P') && Math.abs(mv[1]-mv[0])==16)
			if(board[mv[0]] == 'p')
				enpass = board_with_notations[mv[0] + 8]; 
			else if(board[mv[0]] == 'P')
				enpass = board_with_notations[mv[0] - 8];
			else
				enpass = null;

		//update internal board
		board[board_with_notations.indexOf(move[1])] =  board[board_with_notations.indexOf(move[0])];
		board[board_with_notations.indexOf(move[0])]  = null;

		grabbed_piece_id = null;
		grabbed_piece = false;
		//flip side to move
		if(side_to_move == 'w')
			side_to_move  = 'b';
		else if(side_to_move == 'b')
			side_to_move = 'w';

		
		//set UI button for side to move
		update_move_UI_button();

	}

}

function update_move_UI_button()
{
		if(side_to_move == 'w')
		{
			
			document.getElementById("white_move").style.display = 'block'; 
			document.getElementById("black_move").style.display = 'none';
		}
		else if(side_to_move == 'b')
		{
			document.getElementById("white_move").style.display = 'none'; 
			document.getElementById("black_move").style.display = 'block'; 
		}
}

function update_board(move)
{
	board[board_with_notations.indexOf(move[0])] = null;
	board[board_with_notations.indexOf(move[1])] = null;
}



function get_move_from_UI(square)
{
	if(!grabbed_piece)
	{
		if((square.innerHTML != null) && (side_to_move == piece_color(square.innerHTML)))
		{
			grabbed_piece = true;
			grabbed_piece_id = square.id;
			grabbed_square_id =  square.id;
		}
		return null;
	}
	else
	{
		var move = [grabbed_piece_id, square.id];
		return move;
	}
}


//function called on clicking any square box.
var square_click = function() {

	highlight_square(this);
	var move = get_move_from_UI(this);
	if(move)
		make_move(move);
}

function set_on_click_event_for_squares()
{
	var black_classname = document.getElementsByClassName("white");
	var white_classname = document.getElementsByClassName("black");
	for (var i = 0; i < black_classname.length; i++) {
		black_classname[i].addEventListener('click',square_click , false);
	}
	for (var i = 0; i < white_classname.length; i++) {
		white_classname[i].addEventListener('click',square_click , false);
	}
}

function reset_board()
{
	parse_fen();
	set_board();

	//dehighlight previous square.
	dehighlight_previous_square();
	
	//resetting some global variables.
	prev_highlighted_sq = null;
	prev_highlighted_sq_color = null;

	grabbed_piece = false;
	grabbed_piece_id = null;
	grabbed_square = null;
	
}


function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
} 

function init()
{
	//set initial position  for board.
	parse_fen();	
	set_board();

	//set onclick event for every square(div)
	set_on_click_event_for_squares();
	//
	update_move_UI_button();
}

window.onload = function() {
  init();
};
