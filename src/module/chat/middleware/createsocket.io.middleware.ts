// socket-auth.middleware.ts
import { TokenService } from '../../auth/token-verify.service';
import { MemberService } from '../../member/member.service';

export function createSocketAuthMiddleware(
  tokenService: TokenService,
  memberService: MemberService,
) {
  return async (socket: any, next: (err?: Error) => void) => {
    try {
    //   const token = socket.handshake.auth.token;
    //   const workspaceId = socket.handshake.auth.workspaceId;
       const token =
         'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOGY2MGQ0MC05ZmMxLTRlMzUtYWZkZC1jNzdjNzY0MDk4NGIiLCJyb2xlcyI6WyJNRU1CRVIiLCJPV05FUiJdLCJyb2xlUGVybWlzc2lvbnMiOnsiTUVNQkVSIjpbIlZJRVdfT05MWSIsIkNSRUFURV9UQVNLIiwiRURJVF9UQVNLIl0sIk9XTkVSIjpbIkFERF9NRU1CRVIiLCJDSEFOR0VfTUVNQkVSX1JPTEUiLCJSRU1PVkVfTUVNQkVSIiwiQ1JFQVRFX1dPUktTUEFDRSIsIkVESVRfV09SS1NQQUNFIiwiREVMRVRFX1dPUktTUEFDRSIsIk1BTkFHRV9XT1JLU1BBQ0VfU0VUVElOR1MiLCJDUkVBVEVfUFJPSkVDVCIsIkVESVRfUFJPSkVDVCIsIkRFTEVURV9QUk9KRUNUIiwiQ1JFQVRFX1RBU0siLCJFRElUX1RBU0siLCJERUxFVEVfVEFTSyJdfSwiaWF0IjoxNzQ0MzAyMjE4LCJleHAiOjE3NDQ0NzUwMTh9.PwRFGhPjbQXFzT1ZN_jXlbFRKd0NcJQrEk5YrP9GyVk';
       // const workspaceIdInfo =client.handshake.auth.workspaceId
       const workspaceId = '348c2b45-0a6f-4af0-b632-db98fa96c65e';

      if (!token || !workspaceId) {
        return next(new Error('Missing token or workspaceId'));
      }

      const user = await tokenService.verifyToken(token);
      if (!user) return next(new Error('Invalid token'));

      const isMember = await memberService.findOne(user.sub, workspaceId);
      if (!isMember) return next(new Error('Not a workspace member'));

      // Attach to socket
      socket.data.user = user;
      socket.data.workspaceIdInfo = workspaceId;
      socket.join(`workspace-${workspaceId}`);
      next();
    } catch (err) {
      next(new Error('Authentication error: ' + err.message));
    }
  };
}
