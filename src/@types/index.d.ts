declare namespace Express{
  export interface Request{
    _body: any;
    _query: any;
    session: {
      user: {
        _id: string;
        fullname: string;
        exists: string;
        email: string;
      }
    };
    token: string;
    user: {
      _id: string;
      fullname: string;
      exists: string;
      email: string;
    }
  }
}