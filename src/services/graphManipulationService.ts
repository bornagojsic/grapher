import type { GraphListItem } from "@/types/graph";
import type { GraphOperation } from "@/types/service";

export interface GraphManipulationService {
  registerOperation(operation: GraphOperation): void;
  executeOperation(
    id: string,
    graph: GraphListItem,
    params?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  ): Promise<void>;
  getAvailableOperations(): GraphOperation[];
}

export class OperationRegistry implements GraphManipulationService {
  private operations: Map<string, GraphOperation> = new Map();

  registerOperation(operation: GraphOperation): void {
    this.operations.set(operation.id, operation);
  }

  async executeOperation(
    id: string,
    graph: GraphListItem,
    theme: string,
    params?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  ): Promise<void> {
    const operation = this.operations.get(id);
    if (!operation) {
      throw new Error(`Operation with id "${id}" not found`);
    }

    if (operation.validate && !operation.validate(graph, params)) {
      throw new Error(
        `Operation "${id}" validation failed for the provided graph`,
      );
    }

    await operation.execute(graph, theme, params);
  }

  getAvailableOperations(): GraphOperation[] {
    return Array.from(this.operations.values());
  }
}

// Create a singleton instance of the registry
export const graphManipulationService = new OperationRegistry();
