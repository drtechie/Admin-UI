import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from '../../config/config.service';
import { InterceptedHttp } from './../../../http.interceptor';

@Injectable()
export class SuperAdmin_ServiceProvider_Service {
  // _baseURL = "";
  // _createServiceProviderURL = this._baseURL + "user/userAuthenticate/";
  superadmin_base_url: any;
  providerAdminBaseUrl: any;
  commonbaseurl: any;

  service_provider_setup_url: any;
  getAllStatesUrl: any;
  getAllServiceLinesUrl: any;

  checkProviderNameAvailabilityUrl: any;

  getRegistrationDataUrl: any;
  getAllProviderUrl: any;
  getProviderInfoUrl: any;
  addProviderStateAndServiceLinesUrl: any;
  getAllStatus_URL: any;
  // updateProviderPersonalDetailsUrl: any;


  /* new APIs */
  createProviderUrl: any;
  providerUpdateUrl: any;
  providerDeleteUrl: any;

  getAllProviderMappingsUrl: any;
  mapProviderServiceStateUrl: any;
  editMappedProviderServiceStateUrl: any;
  deleteMappedProviderServiceStateUrl: any;

  constructor(
    private _http: Http,
    public ConfigService: ConfigService,
    private _httpInterceptor: InterceptedHttp
  ) {
    this.superadmin_base_url = this.ConfigService.getSuperAdminBaseUrl();
    this.providerAdminBaseUrl = this.ConfigService.getAdminBaseUrl();
    this.commonbaseurl = this.ConfigService.getCommonBaseURL();

    this.service_provider_setup_url =
      this.superadmin_base_url + 'providerCreationAndMapping';
    this.getAllStatesUrl = this.commonbaseurl + 'location/states/';
    this.getAllServiceLinesUrl = this.providerAdminBaseUrl + 'getServiceline';

    this.checkProviderNameAvailabilityUrl =
      this.providerAdminBaseUrl + 'checkProvider';

    this.getRegistrationDataUrl =
      this.commonbaseurl + 'beneficiary/getRegistrationData';
    this.getAllProviderUrl = this.providerAdminBaseUrl + 'getAllProvider';
    this.getProviderInfoUrl = this.providerAdminBaseUrl + 'getProviderStatus';
    this.addProviderStateAndServiceLinesUrl =
      this.providerAdminBaseUrl + 'addProviderStateAndServiceLines';
    this.getAllStatus_URL = this.providerAdminBaseUrl + 'getStatus';
    // 	this.updateProviderPersonalDetailsUrl = this.providerAdminBaseUrl + "/updateProvider";



    /* new APIs */
    this.createProviderUrl = this.superadmin_base_url + 'createProvider';
    this.providerUpdateUrl = this.superadmin_base_url + 'providerUpdate';
    this.providerDeleteUrl = this.superadmin_base_url + 'providerdelete';

    this.getAllProviderMappingsUrl = this.superadmin_base_url + 'getMappedServiceLinesAndStatetoProvider';
    this.mapProviderServiceStateUrl = this.superadmin_base_url + 'mapServiceLinesAndStatetoProvider';
    this.editMappedProviderServiceStateUrl = this.superadmin_base_url + 'editMappedServiceLinesAndStatetoProvider'
    this.deleteMappedProviderServiceStateUrl = this.superadmin_base_url + 'deleteMappedServiceLinesAndStatetoProvider';
  }

  getCommonRegistrationData() {
    return this._http
      .post(this.getRegistrationDataUrl, {})
      .map(this.extractData)
      .catch(this.handleError);
  }

  checkProviderNameAvailability(provider_name) {
    return this._http
      .post(this.checkProviderNameAvailabilityUrl, {
        'serviceProviderName': provider_name
      })
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllStates(countryID: any) {
    return this._http
      .get(this.getAllStatesUrl + countryID)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllServiceLines() {
    return this._http
      .post(this.getAllServiceLinesUrl, {})
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllProvider() {
    return this._http
      .post(this.getAllProviderUrl, {})
      .map(this.extractData)
      .catch(this.handleError);
  }
  getProviderStatus(provider) {
    return this._http
      .post(this.getProviderInfoUrl, {
        serviceProviderID: provider
      })
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllStatus() {
    return this._http
      .post(this.getAllStatus_URL, {})
      .map(this.extractData)
      .catch(this.handleError);
  }
  addProviderStateAndServiceLines(obj) {
    console.log(obj);
    return this._http
      .post(this.addProviderStateAndServiceLinesUrl, obj)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public createServiceProvider = function (serviceProviderRequestObject) {
    return this._httpInterceptor
      .post(this.service_provider_setup_url, serviceProviderRequestObject)
      .map(this.extractCustomData)
      .catch(this.handleCustomError);
  };

  public createProvider(request_array) {
    return this._httpInterceptor
      .post(this.createProviderUrl, request_array)
      .map(this.extractCustomData)
      .catch(this.handleCustomError);
  }

  public updateProviderDetails(req_obj) {
    return this._httpInterceptor
      .post(this.providerUpdateUrl, req_obj)
      .map(this.extractCustomData)
      .catch(this.handleCustomError);
  }

  public deleteProvider(req_obj) {
    return this._http
      .post(this.providerDeleteUrl, req_obj)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllProviderMappings() {
    return this._httpInterceptor
      .post(this.getAllProviderMappingsUrl, {})
      .map(this.extractCustomData)
      .catch(this.handleCustomError);
  }

  mapProviderServiceState(requestArray) {
    return this._httpInterceptor
      .post(this.mapProviderServiceStateUrl, requestArray)
      .map(this.extractCustomData)
      .catch(this.handleCustomError);
  }

  editMappedProviderServiceState(request_object) {
    return this._httpInterceptor
      .post(this.editMappedProviderServiceStateUrl, request_object)
      .map(this.extractCustomData)
      .catch(this.handleCustomError);
  }

  deleteMappedProviderServiceState(request_object) {
    return this._httpInterceptor
      .post(this.deleteMappedProviderServiceStateUrl, request_object)
      .map(this.extractCustomData)
      .catch(this.handleCustomError);
  }

  private extractCustomData(res: Response) {
    console.log(res, 'in SA service');
    return res.json().data;
  }
  private extractData(res: Response) {
    console.log(res, 'in SA service');
    return res.json().data;
  }
  private handleCustomError(error: Response | any) {
    return Observable.throw(error.json());
  }
  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
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
