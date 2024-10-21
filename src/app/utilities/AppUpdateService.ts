import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

import { concat, interval } from 'rxjs';
import { first} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {
  constructor(
    private appRef : ApplicationRef,
    private readonly updates: SwUpdate
  ) {
  }
  checkForUpdate(){
    const appIsStable$ = this.appRef.isStable.pipe(first(isStable=> isStable === true));
    const everySixHours$ = interval(2*6*1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$,everySixHours$);

    everySixHoursOnceAppIsStable$.subscribe(async () =>{
      try{
        const updateFound =  await this.updates.checkForUpdate();
        console.log(updateFound? 'A new version is available.':'Aready on the latest version');
      }
      catch(err){
        //console.error('Failed to check for updates:',err);
      }
    });
  }

}
