{{/*
Return the name of the chart
*/}}
{{- define "jaeger.name" -}}
{{ .Chart.Name }}
{{- end -}}

{{/*
Return the labels for the chart
*/}}
{{- define "jaeger.labels" -}}
helm.sh/chart: {{ include "jaeger.name" . }}-{{ .Chart.Version | replace "+" "_" }}
{{ include "jaeger.name" . }}.name: {{ .Release.Name }}
{{- end -}}
