import {Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PrivateService } from 'src/app/core/services/private.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Password } from 'src/app/shared/models/password';



@Component({

  selector: 'sp-user-password',
  templateUrl: './user-password.component.html'
})
export class UserPasswordComponent implements OnInit {

  sub:any;
  passwordForm: FormGroup;
  active = true;

  constructor(private privateService: PrivateService, private authService: AuthService,  private builder: FormBuilder) {
  }

  ngOnInit() {

    this.passwordForm = this.builder.group({
        'password': ['', [Validators.required]],
        'newPassword': ['', [Validators.required, ValidationService.passwordValidator]],
        'confirmPassword': ['', Validators.required]},
        {validator: ValidationService.matchingPasswords('newPassword', 'confirmPassword')}
    );

  }

  save(password: Password) {

    if (this.passwordForm.dirty && this.passwordForm.valid) {

      this.privateService.changePassword(password)
        .subscribe(
          resp => {
            if (!resp.token) {
              this.passwordForm.controls['password'].setErrors({'invalidOldPassword': true});
            } else {
              this.authService.updateToken(resp);
              this.authService.showAlert({type:'success', msg:'Password updated'});
              password = <Password>{};
              this.passwordForm.reset();
              this.active = false;
              setTimeout(() => this.active = true, 0);
            }
          });

    }
  }


}
