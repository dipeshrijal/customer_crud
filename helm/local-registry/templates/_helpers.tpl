{{- define "local-registry.name" -}}
{{- .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "local-registry.fullname" -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}-{{- .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "local-registry.labels" -}}
app.kubernetes.io/name: {{ include "local-registry.name" . }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: Helm
{{- end -}}
