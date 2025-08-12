export type CommonUserFields = {
  name: string;
  email: string;
  password: string;
  role: "homeowner" | "provider";
};

export type HomeownerRequestBody = CommonUserFields & {
  role: "homeowner";
  contactNumber: string;
  address: string;
};

export type ProviderRequestBody = CommonUserFields & {
  role: "provider";
  serviceCategory: string;
  skills: string;
  certification: string;
};

export type LoginUserFields={
  email:string,
  password:string
} 
export type UserRequestBody = HomeownerRequestBody | ProviderRequestBody;

export enum ProviderStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum ServiceCategory {
  PLUMBING = "plumbing",
  ELECTRICAL = "electrical",
  CARPENTRY = "carpentry",
  CLEANING = "cleaning",
}