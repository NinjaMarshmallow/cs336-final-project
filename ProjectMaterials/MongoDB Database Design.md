# MongoDB Database Design

### Collections

#### Usernames Collection

	Document Structure:
		{
			"username" : "Littlesnowman88"
		}

	.List of usernames currently connected the service
	
	When a client navigates either back to the welcome page or closes the window, the user is removed from the database as an online user
	
	Users are also removed after 30 minutes of inactivity

#### Challenge Collection

	Document Structure
		{
			"username" : "Littlesnowman88",
			"opponent" : "The Moose",
			"first" : "Littlesnowman88"
		}
		
	Record added when a client in the lobby clicks the name of the desire opponent
	
	Before posting the request, the application chooses randomly who goes first
	
	There will be a listener in the application which queries the challenge table every 2 seconds for records which have its username in the opponent or username field. 
	
	The listener will then post a confirmation challenge inverting the usernames if the other client accepts
	
	The listener will launch a game when there exists two challenges with inverted names in teh username and opponent field
	
	Once the game begins the records for each of the usernames are deleted

#### Moves Collection

	Document Structure:
		{
			"username" : "Littlesnowman88",
			"opponent" : "The Moose",
			"board" : A number between 0 and 8 to isolate which board is being selected,
			"square" : A number between 0 and 8 to isolate which square is selected within the board
		}
		
	Record added when a player in a game clicks on a valid move
	
	Records all moves made by all players
	
	A client queries this collection to retrieve all moves with their username in either the username or the opponent field
	
	The client then updates the display to reflect all the moves made
	
	I think this will be a "stupid" database where it does know that some moves are illegal, it's just up the the application to prevent illegal moves
	
	Once a client declares victory, or one of the clients is not on the online users list (closed the window) all moves associated with both usersnames are deleted
