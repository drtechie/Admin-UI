import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from "../config/config.service";


@Injectable()
export class SeverityTypeService {

  admin_Base_Url: any;
  get_State_Url: any;
  addSeverityUrl: any;

  constructor(private http: Http, public basepaths: ConfigService) {
    this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
    this.get_State_Url = this.admin_Base_Url + "/m/getServerity";
    this.addSeverityUrl = this.admin_Base_Url + "/m/saveServerity ";
   };

   getSeverity(providerServiceMapID) {
     return this.http.post(this.get_State_Url, { "providerServiceMapID": providerServiceMapID })
       .map(this.handleSuccess)
       .catch(this.handleError);
   }

   handleSuccess(response: Response) {
     console.log(response.json(), "calltype-subtype service file success response");
     return response.json().data;
   }
   addSeverity(array) {
     return this.http.post(this.addSeverityUrl, array)
       .map(this.handleSuccess)
       .catch(this.handleError);
   }
   handleError(error: Response | any) {
     let errMsg: string;
     if (error instanceof Response) {
       const body = error.json() || '';
       const err = body.error || JSON.stringify(body);
       errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
     } else {
       errMsg = error.message ? error.message : error.toString();
     }
     console.error(errMsg);
     return Observable.throw(errMsg);
   }

}