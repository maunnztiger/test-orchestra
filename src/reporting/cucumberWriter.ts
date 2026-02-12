export function toCucumberJson(featureReport: any) {
  return [
    {
      uri: featureReport.uri,
      elements: featureReport.scenarios.map((s: any) => ({
        name: s.name,
        keyword: "Scenario",
        tags: s.tags.map((t: string) => ({ name: `@${t}` })),
        steps: s.steps.map((step: any) => ({
          keyword: step.keyword + " ",
          name: step.text,
          result: {
            status: step.status,
            duration: step.durationNs,
            error_message: step.error
          }
        }))
      }))
    }
  ];
}
