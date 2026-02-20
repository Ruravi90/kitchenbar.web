import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';

import { concat, interval } from 'rxjs';
import { filter, first} from 'rxjs/operators';

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
        this.updates.versionUpdates
          .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
          .subscribe(evt => {
          if (this.promptUser(evt)) {
            // Reload the page to update to the latest version.
            document.location.reload();
          }
        });
      }
      catch(err){
        //console.error('Failed to check for updates:',err);
      }
    });
  }

  promptUser(evnt:any):boolean{
    return confirm('Update: Nueva actualización.');
  }

}
