<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Maintenance;
use App\Repository\MaintenanceRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class MaintenanceChronoSubscriber implements EventSubscriberInterface
{
    /**
     * @var MaintenanceRepository
     */
    private $repository;

    public function __construct(MaintenanceRepository $repository)
    {
        $this->repository = $repository;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setChronoForMaintenance', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForMaintenance(ViewEvent $event)
    {
        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($result instanceof Maintenance && $method == "POST") {
            $nextChrono = $this->repository->findNextChrono($result->getVehicule());
            $result->setChrono($nextChrono);
        }
    }
}