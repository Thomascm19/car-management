import {EventEmitter, Injectable, Input} from '@angular/core';

import * as CONFIG from './../config/config';
import { Obstacles } from './../interfaces/obstacles';
import { SingleObstacles } from './../interfaces/single-obstacle';
import { PlayerPosition } from './../interfaces/player-position';

@Injectable()
export class GameService {

  public finishGameEvent: EventEmitter<boolean> = new EventEmitter();
  @Input() public width: number = CONFIG.playGroundWidth;
  @Input() public height: number = CONFIG.playGroundHeight;
  frameNumber: number = CONFIG.frameNumber;
  player: PlayerPosition = {
    x: CONFIG.playGroundWidth / 2 - CONFIG.playerCar.width,
    y: CONFIG.playGroundHeight - (CONFIG.playerCar.height + CONFIG.playerCar.height / 2),
  };

  // @ts-ignore
  context: CanvasRenderingContext2D;
  obstacles: Array<Obstacles> = [];
  // @ts-ignore
  image: HTMLImageElement;
  gameLoop =  null;
  moveUP = false;
  moveDown = false;
  moveLeft = false;
  moveRight = false;

  loadAssets(canvasElement: HTMLCanvasElement): Promise<void>  {
    // @ts-ignore
    this.context = canvasElement.getContext('2d');
    canvasElement.width = this.width;
    canvasElement.height = this.height;
    return new Promise((resolve, reject) => {
      this.image = new Image();
      this.image.src = CONFIG.spritePath;
      this.image.width = 58;
      this.image.height = 128;this.image.onload = () => {
        resolve();
      };
    });
  }

  startGameLoop() {
    // @ts-ignore
    this.gameLoop = setInterval(() => {
      this.suffleProperties();
      this.cleanGround();
      this.createObstacles();
      this.moveObstacles();
      this.createPlayer();
    }, 10);
  }

  animationFrame(n: number): boolean {
    if ((this.frameNumber / n) % 1 === 0) { return true; }
    return false;
  }

  suffleProperties(): void {
    this.frameNumber += 1;
  }

  createObstacles(): void {
    if (this.frameNumber === 1 || this.animationFrame(100)) {
      if (this.obstacles.length > 20) {
        this.obstacles.splice(0, 5);
      }
      this.getSingleObstacle();
    }
  }

  getSingleObstacle(): void {
    const context: CanvasRenderingContext2D | undefined = this.context;
    const image: HTMLImageElement | undefined = this.image;
    const randomVehicle: SingleObstacles = CONFIG.vehicles[Math.floor(Math.random() * CONFIG.vehicles.length)];

    // @ts-ignore
    this.obstacles.push(new function () {
      // @ts-ignore
      this.x = Math.floor(Math.random() * 450) + 0,
        // @ts-ignore
        this.y = Math.floor(Math.random() * -15) + 0,
      // @ts-ignore
      this.width = randomVehicle.width;
      // @ts-ignore
      this.height = randomVehicle.height;
      // @ts-ignore
      this.update = () => {
        context!.drawImage(
          image,
          randomVehicle.sX, randomVehicle.sY,
          randomVehicle.sWidth, randomVehicle.sHeight,
          // @ts-ignore
          this.x, this.y,
          randomVehicle.width, randomVehicle.height
        );
      };
    });
  }

  moveObstacles(): void {
    this.obstacles.forEach((element: Obstacles, index: number) => {
      element.y += 3;
      element.update();
      this.detectCrash(element);
      if (element.y > this.height) {
        this.obstacles.splice(index, 1);
      }
    });
  }

  createPlayer(): void {
    if (this.moveUP) {
      if (this.player.y === 0) {
        this.player.y = 0;
      } else {
        this.player.y -= CONFIG.playerCarSpeed;
      }
    } else if (this.moveDown) {
      if (this.player.y + CONFIG.playerCar.height === CONFIG.playGroundHeight ||
        this.player.y + CONFIG.playerCar.height > CONFIG.playGroundHeight) {
        this.player.y = CONFIG.playGroundHeight - CONFIG.playerCar.height;
      } else {
        this.player.y += CONFIG.playerCarSpeed;
      }
    } else if (this.moveLeft) {
      if (this.player.x === 0 || this.player.x < 0 ) {
        this.player.x = 0;
      } else {
        this.player.x -= CONFIG.playerCarSpeed;
      }
    } else if (this.moveRight) {
      if (this.player.x + CONFIG.playerCar.sWidth === CONFIG.playGroundWidth ||
        this.player.x + CONFIG.playerCar.sWidth > CONFIG.playGroundWidth) {
        this.player.x = CONFIG.playGroundWidth - CONFIG.playerCar.width;
      } else {
        this.player.x += CONFIG.playerCarSpeed;
      }
    }
    this.context!.drawImage(
      this.image,
      CONFIG.playerCar.sX, CONFIG.playerCar.sY,
      CONFIG.playerCar.sWidth, CONFIG.playerCar.sHeight,
      this.player.x, this.player.y,
      CONFIG.playerCar.width, CONFIG.playerCar.height,
    );
  }

  detectCrash(obstacle: Obstacles ): void {

    const componentLeftSide = obstacle.x;
    const componentRightSide = obstacle.x + obstacle.width;
    const componentTop = obstacle.y;
    const componentBottom = obstacle.y + obstacle.height;

    const carRightSide = this.player.x + CONFIG.playerCar.width;
    const carLeftSide = this.player.x;
    const carTop = this.player.y;
    const carBottom = this.player.y + CONFIG.playerCar.height;

    if ((
      (carRightSide > componentLeftSide) && (carTop < componentBottom)
    ) && (
      (carLeftSide < componentRightSide) && (carTop < componentBottom)
    ) && (
      (carRightSide > componentLeftSide) && (carBottom > componentTop)
    ) && (
      (carLeftSide < componentRightSide) && (carBottom > componentTop)
    )
    ) {
      // @ts-ignore
      clearInterval(this.gameLoop);
      this.finishGameEvent.emit(true);
    }
  }

  cleanGround(): void {
    this.context!.clearRect(0, 0, CONFIG.playGroundWidth, CONFIG.playGroundHeight);
  }

}
