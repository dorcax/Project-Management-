import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class TokenService {
  constructor(private readonly jwtService:JwtService){}
 async verifyToken(token:string){
   try {
    return this.jwtService.verify(token)
   } catch (error) {
    throw new UnauthorizedException("invlaid token")
   }
  }

}