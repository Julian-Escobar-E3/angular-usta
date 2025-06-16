import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('jwt_token');
  if (!token) return next(req);
  const newRequest = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });
  return next(newRequest);
};
