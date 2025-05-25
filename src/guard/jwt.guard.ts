import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import {Request} from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
constructor(private jwtService:JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const request = context.switchToHttp().getRequest();
    console.log("Request Headers: " + JSON.stringify(request.headers));
    const token = extractFromHeader(request);
    console.log("Token: " + token);
    if(!token){
        // return false; //this will return Forbidden 403 error. so better to avoid this.
        throw new UnauthorizedException("Invalid Null Token.");
    }
    //So the token is not empty so validation required!
    try{
        const payload = this.jwtService.verify(token, { secret: process.env.ACCESS_TOKEN_SECRET as string }); // Throw error in case of expired token or unavailable Token
        request.user = payload;
        console.log("Paylod: " + request.user);

    }catch(error){
      console.log("Paylod Error: " + error);
        Logger.error(error.message); //console logging the error 
        throw new UnauthorizedException("Invalid Entry of Token.")
    }
    return true;
  }
}

function extractFromHeader(request: Request): string | undefined {
  // console.log("Incoming Headers:", request.headers);
  console.log("Incoming Cookies:", request.headers.cookie?.toString().split('=')[1]);

  const cookieToken = request.headers.cookie?.toString().split('=')[1];
  const authHeader = request.headers.authorization?.split(' ')[1];

  console.log("Extracted AuthHeader: " + authHeader);
  console.log("Extracted CookieToken: " + cookieToken);

  return authHeader || cookieToken;
}

