import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import googleOauth from "src/module/config/google-oauth";
import { AuthService } from "../auth.service";
import { ownerDefaultPermissions, Role } from "../entities/role.entity";



@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    @Inject(googleOauth.KEY)
    private googleConfiguration: ConfigType<typeof googleOauth>,
  ) {
    if (
      !googleConfiguration.clientID ||
      !googleConfiguration.clientSecret ||
      !googleConfiguration.callbackURL
    ) {
      throw new Error('Google OAuth configuration is missing required values.');
    }

    super({
      clientID: googleConfiguration.clientID,
      clientSecret: googleConfiguration.clientSecret,
      callbackURL: googleConfiguration.callbackURL,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  //   verify
//   async validate(
//     request: any,
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: VerifyCallback,
//   ) {
//     console.log({ profile });
//     const user = await this.authService.validateGoogleUser({
//       email: profile._json?.email,
//       name: profile.displayName,
//       password: 'mypassword'
//     });
//     done(null, user);
//   }
// }



async validate(
  request: any,
  accessToken: string,
  refreshToken: string,
  profile: any,
  done: VerifyCallback,
) {
  console.log({ profile });

  const email = profile._json?.email;
  const name = profile.displayName;

  if (!email || !name) {
    return done(new Error('Google profile is missing required fields'));
  }

  const user = await this.authService.validateGoogleUser({
    email,
    name,
    password:"string"
  });

  done(null, user);
}
}


