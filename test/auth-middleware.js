const authMiddleware = require("../middleware/is-auth");
const expect = require("chai").expect;
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

describe("Auth middleware", () => {
  it("should throw an error if no auth header is pressent", () => {
    const req = {
      get: (headerName) => {
        return null;
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Not authenticated."
    );
  });

  it("should throw n error if the authorization header is only one string", () => {
    const req = {
      get: (headerName) => {
        return "xyz";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should throw an error if the token cannot ve verified", () => {
    const req = {
      get: (headerName) => {
        return "Bearer xyz";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
  it("should yield a userId after decoding the token", () => {
    const req = {
      get: (headerName) => {
        return "Bearer bsfbsfbsrthtrhetrhert";
      },
    };
    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });
});
