module "cloudfront_origin_access_identity" {
  source = "./cloudfront_origin_access_identity"
  site_name = var.site_name
}

module "s3" {
  source = "./s3"
  oai_iam_arn = module.cloudfront_origin_access_identity.oai_iam_arn
  site_name = var.site_name
}

module "cloudfront" {
  source = "./cloudfront"
  acm_certificate_arn = var.acm_certificate_arn
  aws_region = var.aws_region
  oai_cloudfront_access_identity_path = module.cloudfront_origin_access_identity.oai_cloudfront_access_identity_path
  s3_origin_bucket = module.s3.s3_origin_bucket
  site_name = var.site_name
}

output "cloudfront_info" {
  value = module.cloudfront.cloudfront_info.domain_name
  sensitive = true
}
