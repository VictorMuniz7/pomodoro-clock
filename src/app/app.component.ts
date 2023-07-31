import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pomodoro-clock';

  workTime = '25:00';
  breakTime = '05:00';

  currentTimer = this.workTime;
  nextTimer = this.breakTime;

  preMsg = 'Next break';

  running = 'Work';

  editDisplay: 'none' | 'flex' = 'none';

  hideError = true;

  workMinutes : any;
  workSeconds : any;
  breakMinutes : any;
  breakSeconds : any;

  originalTime: number = this.convertString(this.currentTimer);
  remainingTime: number = this.originalTime;
  intervalId: any;
  isRunning: boolean = false

  start(){
    if(!this.isRunning){
      this.isRunning = true;
      this.intervalId = setInterval(() => {
        if(this.remainingTime > 0){
          this.remainingTime -= 1000;
          this.currentTimer = this.convertMilliseconds(this.remainingTime);
        }else{
          this.playSound()
          this.pause();
          this.breakOrWork();
        }
      }, 1000);
    }
  }

  breakOrWork(){
    if(this.running === 'Work'){
      this.running = 'Break';
      this.currentTimer = this.breakTime
      this.preMsg = 'Next work';
      this.nextTimer = this.workTime
      this.remainingTime = this.convertString(this.currentTimer)
    }
    else{
      this.running = 'Work';
      this.currentTimer = this.workTime
      this.preMsg = 'Next break';
      this.nextTimer = this.breakTime
      this.remainingTime = this.convertString(this.currentTimer)

    }
  }

  toggleDisplay() {
    this.editDisplay = this.editDisplay === 'none' ? 'flex' : 'none';
  }

  updateTimer(){
    if(this.validate()){
      this.hideError = true
      this.workTime = `${this.workMinutes}:${this.workSeconds}`;
      this.breakTime = `${this.breakMinutes}:${this.breakSeconds}`;
      this.currentTimer = this.workTime;
      this.nextTimer = this.breakTime;
      this.remainingTime = this.convertString(this.currentTimer)
      this.toggleDisplay()
    }else{
      this.hideError = false;
    }

  }

  pause(){
    if(this.isRunning && this.intervalId){
      clearInterval(this.intervalId);
      this.isRunning = false
    }
  }

  reset(){
    this.pause()
    if(this.running = 'Work'){
      this.currentTimer = this.workTime;
      this.remainingTime = this.convertString(this.workTime)
    }else{
      this.currentTimer = this.breakTime;
      this.remainingTime = this.convertString(this.breakTime)
    }
  }

  validate(){
    return(
      this.isValid(this.workMinutes) &&
      this.isValid(this.workSeconds) &&
      this.isValid(this.breakMinutes) &&
      this.isValid(this.breakSeconds)
    )
  }

  isValid(value: number): boolean{
    return value <= 59 && value.toString().length === 2;
  }

  playSound(){
    const audio = new Audio('/assets/sounds/alarm-sound-effect.mp3')
    audio.play();
  }

  convertString(timeString: string): number{
    const [minutes, seconds] = timeString.split(':').map(Number);

    const totalMilliseconds = (minutes * 60 + seconds) * 1000;

    return totalMilliseconds;
  }

  convertMilliseconds(milliseconds: number):string{
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
