terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  region = var.region
}

module "vpc" {
  source          = "./modules/vpc"
  vpc_name        = var.vpc_name
  vpc_cidr        = var.vpc_cidr
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets
  az              = var.az
  eks_cluster_name = var.cluster_name
}

module "eks" {
  source           = "./modules/eks"
  cluster_name     = var.cluster_name
  cluster_version  = var.cluster_version
  vpc_id           = module.vpc.vpc_id
  subnet_ids       = module.vpc.private_subnets_id
  desired_capacity = var.desired_capacity
  min_capacity     = var.min_capacity
  max_capacity     = var.max_capacity
  instance_types   = var.instance_types
  public_subnets   = module.vpc.public_subnets_id

  depends_on = [module.vpc]
}

provider "kubernetes" {
  host                   = module.eks.eks_cluster_endpoint
  token                  = module.eks.eks_clsuter_auth_token
  cluster_ca_certificate = base64decode(module.eks.eks_cluster_ca)
}

provider "helm" {
  alias = "argocd"
  kubernetes {
    host                   = module.eks.eks_cluster_endpoint
    token                  = module.eks.eks_clsuter_auth_token
    cluster_ca_certificate = base64decode(module.eks.eks_cluster_ca)
  }
}

provider "helm" {
  alias = "istio"
  kubernetes {
    host                   = module.eks.eks_cluster_endpoint
    token                  = module.eks.eks_clsuter_auth_token
    cluster_ca_certificate = base64decode(module.eks.eks_cluster_ca)
  }
}

module "argocd" {
  source = "./modules/argocd"
  providers = {
    helm       = helm.argocd
    kubernetes = kubernetes
  }
  depends_on = [module.eks]
}

module "istio" {
  source = "./modules/istio"
  public_subnet_ids = module.vpc.public_subnets_id  
  providers = {
    helm       = helm.istio
    kubernetes = kubernetes
  }
  depends_on = [module.eks]
}
