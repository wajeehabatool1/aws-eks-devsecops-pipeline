output "eks_cluster_id" {
  value = aws_eks_cluster.eks.id
}
output "cluster_name" {
  value = aws_eks_cluster.eks.name
}
output "eks_cluster_endpoint" {
  value = aws_eks_cluster.eks.endpoint
}

output "aws_eks_node_group_name" {
  value = aws_eks_node_group.eks_nodes.node_group_name
}

output "eks_cluster_ca" {
  value = aws_eks_cluster.eks.certificate_authority[0].data
}

output "eks_clsuter_auth_token" {
  value = data.aws_eks_cluster_auth.cluster.token
}