// process.stdout.write("hello: ");
// process.stdout.cursorTo(0);
// process.stdout.write("world");

// process.stdout.write("a\n\r\b\bbc");

// const MAP_X = 10;
// const MAP_Y = 2;
// var aOutput = [];
// for (var y=0;y<MAP_Y;y++) {
//    var sLine = Array(MAP_X).fill("#").join("");
//    aOutput.push(sLine + "\n");
// }
// process.stdout.write(aOutput.join(""));

// aOutput = [];
// process.stdout.cursorTo(0);
// process.stdout.write("\b");
// for (var y=0;y<MAP_Y;y++) {
//    var sLine = Array(MAP_X).fill(".").join("");
//    aOutput.push(sLine + "\n");
// }
// process.stdout.write(aOutput.join(""));

var Direction = {
   UP: 38,
   RIGHT: 39,
   DOWN: 40,
   LEFT: 37
};

var MAP_X = 10;
var MAP_Y = 10;

function SnakeModel() {
   var _oSnakeModel = this;

   var _oSnake = {
      head: {
         posX: Math.floor((MAP_X - 1) / 2),
         posY: Math.floor((MAP_X - 1) / 2),
         direction: Direction.UP
      },
      body: [{
         posX: Math.floor((MAP_X - 1) / 2),
         posY: Math.floor((MAP_X - 1) / 2) + 1
      }, {
         posX: Math.floor((MAP_X - 1) / 2),
         posY: Math.floor((MAP_X - 1) / 2) + 2
      }]
   };

   this.snake = {
      head: {},
      body: _oSnake.body
   };
   Object.defineProperty(this.snake.head, 'posX', {
      get: function() {
         return _oSnake.head.posX;
      },
      set: function(nValue) {
         _oSnake.head.posX = nValue;
         _oSnakeModel.onModelChange();
      }
   });
   Object.defineProperty(this.snake.head, 'posY', {
      get: function() {
         return _oSnake.head.posY;
      },
      set: function(nValue) {
         _oSnake.head.posY = nValue;
         _oSnakeModel.onModelChange();
      }
   });

   this.onModelChange = function() {

   };

   this.onKeyDown = function(oEvent) {
      var _fMoveBody = function() {
         var oBody = _oSnakeModel.snake.body;
         for (var i=oBody.length-1; i>0; i--) {
            oBody[i].posX = oBody[i-1].posX;
            oBody[i].posY = oBody[i-1].posY;
         }

         if (oBody.length > 0) {
            oBody[0].posX = _oSnakeModel.snake.head.posX;
            oBody[0].posY = _oSnakeModel.snake.head.posY;
         }
      };

      switch (oEvent.keyCode) {
         case 37: // left
            if (_oSnakeModel.snake.head.posX > 0) {
               _fMoveBody();
               _oSnakeModel.snake.head.posX = _oSnakeModel.snake.head.posX - 1;
            }
            break;
         case 38: // up
            if (_oSnakeModel.snake.head.posY > 0) {
               _fMoveBody();
               _oSnakeModel.snake.head.posY = _oSnakeModel.snake.head.posY - 1;
            }
            break;
         case 39: // right
            if (_oSnakeModel.snake.head.posX < MAP_X - 1) {
               _fMoveBody();
               _oSnakeModel.snake.head.posX = _oSnakeModel.snake.head.posX + 1;
            }
            break;
         case 40: // down
            if (_oSnakeModel.snake.head.posY < MAP_Y - 1) {
               _fMoveBody();
               _oSnakeModel.snake.head.posY = _oSnakeModel.snake.head.posY + 1;
            }
            break;
      }
   };


}



this.renderLayout = function(elCanvas) {
   for (var y=0; y<MAP_Y; y++) {
      for (var x=0; x<MAP_X; x++) {
         var elCell = document.createElement("div");
         elCell.classList.add("cell");
         elCell.classList.add("cell_" + y + "_" + x);
         elCell.classList.add("row_" + y);
         elCell.classList.add("col_" + x);
         elCanvas.appendChild(elCell);
      }
   }
};

this.renderSnake = function(elCanvas, oSnakeModel) {
   var elCells = elCanvas.children;
   for (var i=0; i<elCells.length; i++) {
      elCells[i].innerHTML = "";
   }

   var x = oSnakeModel.snake.head.posX;
   var y = oSnakeModel.snake.head.posY;
   var elHead = document.createElement("div");
   elHead.classList.add("snake-head");
   elCells[MAP_X*y+x].appendChild(elHead);

   for (var j=0; j<oSnakeModel.snake.body.length; j++) {
      var nCurPosX = oSnakeModel.snake.body[j].posX;
      var nCurPosY = oSnakeModel.snake.body[j].posY;
      var elBody = document.createElement("div");
      elBody.classList.add("snake-body");
      elCells[MAP_X*nCurPosY+nCurPosX].appendChild(elBody);
   }
};

window.onload = function() {
   var oSnakeModel = new SnakeModel();
   var elCanvas = document.getElementById("canvas");
   renderLayout(elCanvas);
   renderSnake(elCanvas, oSnakeModel);

   oSnakeModel.onModelChange = function() {
      renderSnake(elCanvas, oSnakeModel);
   };
   document.body.addEventListener('keydown', oSnakeModel.onKeyDown);
};