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
  const cookieHeader = request.headers.cookie;

  // Extract token from Authorization header if available
  const authHeader = request.headers.authorization?.split(' ')[1];
  if (authHeader) {
    console.log("Extracted AuthHeader: " + authHeader);
    return authHeader;
  }

  // Extract token from cookies if Authorization header not present
  if (cookieHeader) {
    const cookies = cookieHeader.split('; ').reduce<Record<string, string>>((acc, current) => {
      const [key, value] = current.split('=');
      acc[key] = value;
      return acc;
    }, {});

    const cookieToken = cookies['accessToken'];
    console.log("Extracted CookieToken: " + cookieToken);
    return cookieToken;
  }

  return undefined;
}


