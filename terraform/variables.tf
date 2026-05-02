variable "aws_region" {
  description = "AWS region for the infrastructure"
  type = string
  default = "us-east-1"
}

variable "acm_certificate_arn" {
  description = "ACM Certificate for the domain"
  type = string
}

variable "site_name" {
  description = "Site name"
  type = string
  default = "jspollock.art"
}
