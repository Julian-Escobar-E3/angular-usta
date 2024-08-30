export interface IGraduate {
  id_graduate: string;
  identity_document: string;
  fullname: string;
  gender: string;
  admission_period: Date;
  egress_period: Date;
  graduation_date: Date;
  phone_number: string;
  personal_email: string;
  residence: string;
  url_linkedin: string;
  url_cvlac?: null;
  createdAt: Date;
  updatedAt: Date;
  job?: Job | null;
  postgraduate_degree?: PostgraduateDegrees | null;
}

export interface Job {
  id_job: string;
  title: string;
  modality: string;
  countryCompany: string;
  cityCompany: string;
}

export interface PostgraduateDegrees {
  id_postgraduate: string;
  postgraduate_degree_type: string;
  degree_obtained: string;
  university: string;
  year_obtained: string;
  country: string;
}
