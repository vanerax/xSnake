"use strict";

var Direction = {
   UP: 38,
   RIGHT: 39,
   DOWN: 40,
   LEFT: 37
};

var KeyCodeToDirection = {
   38: Direction.UP,
   39: Direction.RIGHT,
   40: Direction.DOWN,
   37: Direction.LEFT
};

function SnakeModel() {
   var _oSnakeModel = this;

   this.cellUnit = 32;
   this.mapWidth = 20;
   this.mapHeight = 10;

   var _oSnake = {
      head: {
         posX: Math.floor((this.mapWidth - 1) / 2),
         posY: Math.floor((this.mapHeight - 1) / 2),
         direction: Direction.UP
      },
      body: [
      // {
      //    posX: Math.floor((this.mapWidth - 1) / 2),
      //    posY: Math.floor((this.mapHeight - 1) / 2) + 1
      // }, {
      //    posX: Math.floor((this.mapWidth - 1) / 2),
      //    posY: Math.floor((this.mapHeight - 1) / 2) + 2
      // }
      ]
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
   Object.defineProperty(this.snake.head, 'direction', {
      get: function() {
         return _oSnake.head.direction;
      },
      set: function(nValue) {
         _oSnake.head.direction = nValue;
         _oSnakeModel.onModelChange();
      }
   });

   this.food = {};

   this.generateFood = function() {

   };

   this.onModelChange = function() { };

   this.onKeyDown = function(oEvent) {
      var eDir = KeyCodeToDirection[oEvent.keyCode];
      if (eDir && this.isReachable(eDir)) {
         this.move(eDir);
      }
   };

   this.getHeadPosition = function() {
      return {
         x: this.snake.head.posX,
         y: this.snake.head.posY
      };
   };

   this.calcNextPosition = function(eDirection, oCurPos) {
      var oNextPos = {
         x: oCurPos.x,
         y: oCurPos.y
      };

      switch (eDirection) {
         case Direction.UP:
            oNextPos.y -= 1;
            break;

         case Direction.RIGHT:
            oNextPos.x += 1;
            break;

         case Direction.DOWN:
            oNextPos.y += 1;
            break;

         case Direction.LEFT:
            oNextPos.x -= 1;
            break;
      }
      return oNextPos;
   };

   this.getReverseDirection = function(eDirection) {
      var eRet;
      switch (eDirection) {
         case Direction.UP:
            eRet = Direction.DOWN;
            break;

         case Direction.RIGHT:
            eRet = Direction.LEFT;
            break;

         case Direction.DOWN:
            eRet = Direction.UP;
            break;

         case Direction.LEFT:
            eRet = Direction.RIGHT;
            break;
      }
      return eRet;
   };

   this.getNextDirection = function(eDirection) {
      var aDirs = [Direction.DOWN, Direction.RIGHT, Direction.UP, Direction.LEFT];
      var nPos = aDirs.indexOf(eDirection);
      nPos = (nPos + 1) % aDirs.length;
      return aDirs[nPos];
   };

   // return where is oCurPos
   this.calcDirection = function(oCurPos, oRelPos) {
      var eDir;
      if (oCurPos.y === oRelPos.y) {
         if (oCurPos.x > oRelPos.x) {
            eDir = Direction.RIGHT;
         } else if (oCurPos.x < oRelPos.x) {
            eDir = Direction.LEFT;
         }
      } else if (oCurPos.x === oRelPos.x) {
         if (oCurPos.y > oRelPos.y) {
            eDir = Direction.DOWN;
         } else if (oCurPos.y < oRelPos.y) {
            eDir = Direction.UP;
         }
      }
      return eDir;
   };

   this.move = function(eDirection) {
      var oNextPos = this.calcNextPosition(eDirection, this.getHeadPosition());
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

      _fMoveBody();
      _oSnakeModel.snake.head.posX = oNextPos.x;
      _oSnakeModel.snake.head.posY = oNextPos.y;
      _oSnakeModel.snake.head.direction = eDirection;
   };

   this.isReachable = function(eDirection) {
      var oPos = this.calcNextPosition(eDirection, this.getHeadPosition());
      return this.isInMap(oPos) && !this.isSelfOccupied(oPos);
   };

   this.isCellAvailable = function(oPos) {
      return this.isInMap(oPos) && !this.isSelfOccupied(oPos);
   };

   this.isInMap = function(oPos) {
      return oPos.x >= 0 && oPos.x < this.mapWidth && oPos.y >= 0 && oPos.y < this.mapHeight;
   };

   this.isSelfOccupied = function(oPos) {
      var bRet = false;
      for (var i=0;i<this.snake.body.length;i++) {
         var oBody = this.snake.body[i];
         if (oBody.posX === oPos.x && oBody.posY === oPos.y) {
            bRet = true;
            break;
         }
      }
      return bRet;
   };

   this.addTail = function() {
      var oNextPos;
      var eFirstDir, eDir;
      var oCurPos, oRelPos;
      if (this.snake.body.length === 0) {
         eDir = this.getReverseDirection(this.snake.head.direction);
         oNextPos = this.calcNextPosition(eDir, this.getHeadPosition());
         
      } else if (this.snake.body.length === 1) {
         oRelPos = { 
            x: this.snake.head.posX,
            y: this.snake.head.posY
         };
         oCurPos = {
            x: this.snake.body[0].posX,
            y: this.snake.body[0].posY
         };
         eDir = this.calcDirection(oCurPos, oRelPos);
         oNextPos = this.calcNextPosition(eDir, oCurPos);
      } else {
         var nLen = this.snake.body.length;
         oRelPos = { 
            x: this.snake.body[nLen-2].posX,
            y: this.snake.body[nLen-2].posY
         };
         oCurPos = {
            x: this.snake.body[nLen-1].posX,
            y: this.snake.body[nLen-1].posY
         };
         eDir = this.calcDirection(oCurPos, oRelPos);
         oNextPos = this.calcNextPosition(eDir, oCurPos);
      }    

      eFirstDir = eDir;
      while (!this.isCellAvailable(oNextPos)) {
         eDir = this.getNextDirection(eDir);
         if (eDir === eFirstDir) {
            throw "unable to add tail";
         }
         oNextPos = this.calcNextPosition(eDir, oCurPos);
      }

      this.snake.body.push({
         posX: oNextPos.x,
         posY: oNextPos.y
      });
   };

   this.addTails = function(nLength) {
      for (var i=0;i<nLength;i++) {
         this.addTail();
      }
   };
}

window.onload = function() {
   var renderLayout = function(elCanvas, oSnakeModel) {
      elCanvas.style.width = oSnakeModel.mapWidth * oSnakeModel.cellUnit + "px";

      for (var y=0; y<oSnakeModel.mapHeight; y++) {
         for (var x=0; x<oSnakeModel.mapWidth; x++) {
            var elCell = document.createElement("div");
            elCell.classList.add("cell");
            elCell.classList.add("cell_" + y + "_" + x);
            elCell.classList.add("row_" + y);
            elCell.classList.add("col_" + x);
            elCanvas.appendChild(elCell);

            var oContext = {
               posX: x,
               posY: y,
               snakeModel: oSnakeModel
            };
            renderSnakeCell(elCell, oContext);
         }
      }
   };

   var renderSnake = function(elCanvas, oSnakeModel) {
      var elCells = elCanvas.children;
      for (var i=0; i<elCells.length; i++) {
         elCells[i].innerHTML = "";
      }

      var x = oSnakeModel.snake.head.posX;
      var y = oSnakeModel.snake.head.posY;
      var elHead = document.createElement("div");
      elHead.classList.add("snake-head");
      elCells[oSnakeModel.mapWidth*y+x].appendChild(elHead);

      for (var j=0; j<oSnakeModel.snake.body.length; j++) {
         var nCurPosX = oSnakeModel.snake.body[j].posX;
         var nCurPosY = oSnakeModel.snake.body[j].posY;
         var elBody = document.createElement("div");
         elBody.classList.add("snake-body");
         elCells[oSnakeModel.mapWidth*nCurPosY+nCurPosX].appendChild(elBody);
      }
   };

   var renderSnakeCell = function(elCell, oContext) {
      var oSnakeModel = oContext.snakeModel;
      if (oSnakeModel.snake.head.posX === oContext.posX && oSnakeModel.snake.head.posY === oContext.posY) {
         var elHead = document.createElement("div");
         elHead.classList.add("snake-head");
         elCell.appendChild(elHead);
      } else {
         for (var i=0;i<oSnakeModel.snake.body.length;i++) {
            var oBody = oSnakeModel.snake.body[i];
            if (oBody.posX === oContext.posX && oBody.posY === oContext.posY) {
               var elBody = document.createElement("div");
               elBody.classList.add("snake-body");
               elBody.classList.add("snake-body-" + i);
               elCell.appendChild(elBody);
            }
         }
      }
   };

   var renderFoodCell = function(elCell, oContext) {

   };

   var oSnakeModel = new SnakeModel();

   oSnakeModel.addTails(3);
   var elCanvas = document.getElementById("canvas");
   renderLayout(elCanvas, oSnakeModel);
   //renderSnake(elCanvas, oSnakeModel);

   oSnakeModel.onModelChange = function() {
      renderSnake(elCanvas, oSnakeModel);
   };
   document.body.addEventListener('keydown', oSnakeModel.onKeyDown.bind(oSnakeModel));
};