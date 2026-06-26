import SceneArrival from '../app/components/layout/SceneArrival'
import ScenePhilosophy from '../app/components/layout/ScenePhilosopy'
import SceneProblem from '../app/components/layout/SceneProblem'
import SceneVision from '../app/components/layout/SceneVision'
import SceneJourney from '../app/components/layout/SceneJourney'
import SceneFounder from '../app/components/layout/SceneFounder'
import SceneMaterials from '../app/components/layout/SceneMaterial'
import SceneJoin from '../app/components/layout/SceneJoin'
import SceneEnding from '../app/components/layout/SceneEnding'

export default function Home() {
  return (
    <main>
      <SceneArrival />
      <ScenePhilosophy />
      <SceneProblem />
      <SceneVision />
      <SceneJourney />
      <SceneFounder />
      <SceneMaterials />
      <SceneJoin />
      <SceneEnding />
    </main>
  )
}