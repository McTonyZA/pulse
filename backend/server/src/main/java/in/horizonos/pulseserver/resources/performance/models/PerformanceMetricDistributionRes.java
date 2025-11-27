package in.horizonos.pulseserver.resources.performance.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PerformanceMetricDistributionRes {
   private List<String> fields;
   private List<List<String>> rows;
}
