variable "aws_region" {
  type = string
  description = "AWS Region the infrastructure will be created in"
}

variable "acm_certificate_arn" {
  description = "ACM Certificate for the domain"
  type = string
}

variable "oai_cloudfront_access_identity_path" {
  type = string
}

variable "s3_origin_bucket" {
  description = "AWS S3 origin bucket"
}

variable "site_name" {
  type = string
  description = "Site name"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = var.s3_origin_bucket.bucket_regional_domain_name
    origin_id   = "S3-Website-${var.s3_origin_bucket.id}.s3-website-us-east-1.amazonaws.com"
    s3_origin_config {
      origin_access_identity = var.oai_cloudfront_access_identity_path
    }
  }

  enabled = true
  price_class = "PriceClass_100"
  is_ipv6_enabled = true
  default_root_object = "index.html"

  aliases = [ var.site_name, "www.${var.site_name}" ]

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-Website-${var.s3_origin_bucket.id}.s3-website-us-east-1.amazonaws.com"

    forwarded_values {
      query_string = true
      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 1000
    max_ttl                = 86400
    compress               = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Environment = "production"
  }

  custom_error_response {
    error_code    = 403
    response_code = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code    = 404
    response_code = 200
    response_page_path = "/index.html"
  }

  viewer_certificate {
    acm_certificate_arn = var.acm_certificate_arn
    minimum_protocol_version = "TLSv1.2_2019"
    cloudfront_default_certificate = false
    ssl_support_method = "sni-only"
  }
}

output "cloudfront_info" {
  value = aws_cloudfront_distribution.s3_distribution
  sensitive = true
}
