import { Component, OnInit } from '@angular/core';
import { HttpServices } from '../services/http-services/http_services.service';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config/config.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { loginService } from '../services/loginService/login.service';




@Component({
	selector: 'app-set-password',
	templateUrl: './set-password.component.html',
	styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent implements OnInit {


	passwordPattern = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/;


	constructor(
		public http_calls: HttpServices,
		public getUserData: dataService,
		private configService: ConfigService,
		public router: Router, private alertService: ConfirmationDialogsService,
		public _loginService: loginService) { }

	ngOnInit() {
	}

	newpwd: any;
	confirmpwd: any;

	uname: any = this.getUserData.uname;

	dynamictype: any = "password";

	showPWD() {
		this.dynamictype = 'text';
	}

	hidePWD() {
		this.dynamictype = 'password';
	}

	updatePassword(new_pwd) {
		if (new_pwd === this.confirmpwd) {
			this.http_calls.postData(this.configService.getCommonBaseURL() + 'user/setForgetPassword',
				{ 'userName': this.uname, 'password': new_pwd }
			).subscribe(
				(response: any) => this.successCallback(response),
				(error: any) => this.errorCallback(error)
				);
		}
		else {
			this.alertService.alert('Password does not match');
		}
	}

	successCallback(response) {

		console.log(response);
		this.alertService.alert('Password changed Successfully');
		this.logout();
		// this.router.navigate(['']);
	}
	errorCallback(response) {
		console.log(response);
	}

	logout() {
		this._loginService.removeTokenFromRedis()
			.subscribe(response => {
				if (response.response.toLowerCase() === 'success'.toLowerCase()) {
					console.log('successfully logged out from CRM and session ended both sides');
					localStorage.removeItem('authToken');
					this.router.navigate(['']);
				}
			}, err => {
				console.log(err, 'error while ending session both sides');

			});
	}


}
