variable "cluster_name" {
  type = string
}

variable "cluster_version" {
  type = string
  
}

variable "vpc_id" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "desired_capacity" {
  type = number
}

variable "min_capacity" {
  type = number
}

variable "max_capacity" {
  type = number
}

variable "instance_types" {
  type = list(string)
}

variable "public_subnets" {
  type = list(string)
}